-- Registra el monto original de un financiamiento como una única compra de tarjeta.
begin;

alter table public.deudas
  add column if not exists credit_card_id uuid,
  add column if not exists initial_expense_id text;

alter table public.deudas
  drop constraint if exists deudas_credit_card_id_fkey,
  add constraint deudas_credit_card_id_fkey
    foreign key (credit_card_id) references public.tarjetas_credito(id) on delete set null,
  drop constraint if exists deudas_initial_expense_id_fkey,
  add constraint deudas_initial_expense_id_fkey
    foreign key (initial_expense_id) references public.gastos(id) on delete set null;

create index if not exists idx_deudas_credit_card_id
  on public.deudas(credit_card_id) where credit_card_id is not null;

create or replace function public.registrar_financiamiento_con_tarjeta(
  p_debt jsonb,
  p_expense jsonb,
  p_credit_card_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_debt_id text;
  v_expense_id text;
  v_debt public.deudas;
  v_card public.tarjetas_credito;
begin
  if v_user_id is null then
    raise exception 'Debes iniciar sesión para registrar el financiamiento.';
  end if;

  if coalesce(p_debt->>'type', '') <> 'financing' then
    raise exception 'Esta operación solo permite registrar financiamientos.';
  end if;

  select * into v_card
  from public.tarjetas_credito
  where id = p_credit_card_id and user_id = v_user_id and active = true;

  if not found then
    raise exception 'La tarjeta seleccionada no existe o está inactiva.';
  end if;

  if not exists (
    select 1 from public.categorias c
    where c.id = p_expense->>'category_id'
      and c.type = 'expense'
      and c.active = true
      and (c.user_id is null or c.user_id = v_user_id)
  ) then
    raise exception 'La categoría del gasto no existe o está inactiva.';
  end if;

  v_debt_id := p_debt->>'id';
  v_expense_id := p_expense->>'id';

  if coalesce(v_debt_id, '') = '' or coalesce(v_expense_id, '') = '' then
    raise exception 'No se pudieron generar los identificadores del registro.';
  end if;

  insert into public.deudas (
    id, user_id, type, name, institution, original_amount, initial_balance,
    current_balance, interest_rate, installment_amount, frequency,
    start_date, first_due_date, notes, is_active, currency,
    default_payment_method, default_credit_card_id, credit_card_id, initial_expense_id
  ) values (
    v_debt_id, v_user_id, 'financing',
    p_debt->>'name', nullif(p_debt->>'institution',''),
    (p_debt->>'original_amount')::numeric,
    (p_debt->>'initial_balance')::numeric,
    (p_debt->>'current_balance')::numeric,
    coalesce(nullif(p_debt->>'interest_rate','')::numeric, 0),
    coalesce(nullif(p_debt->>'installment_amount','')::numeric, 0),
    coalesce(nullif(p_debt->>'frequency',''), 'monthly'),
    (p_debt->>'start_date')::date,
    nullif(p_debt->>'first_due_date','')::date,
    coalesce(p_debt->>'notes',''),
    coalesce((p_debt->>'is_active')::boolean, true),
    coalesce(nullif(p_debt->>'currency',''), 'GTQ'),
    coalesce(nullif(p_debt->>'default_payment_method',''), 'cash'),
    nullif(p_debt->>'default_credit_card_id','')::uuid,
    p_credit_card_id,
    null
  );

  insert into public.gastos (
    id, user_id, date, description, category_id, category_name, currency,
    amount, exchange_rate, amount_gtq, exchange_rate_source, notes,
    payment_method, credit_card_id, statement_cutoff_date, statement_due_date
  ) values (
    v_expense_id, v_user_id,
    (p_expense->>'date')::date,
    p_expense->>'description',
    p_expense->>'category_id',
    p_expense->>'category_name',
    coalesce(nullif(p_expense->>'currency',''), 'GTQ'),
    (p_expense->>'amount')::numeric,
    coalesce(nullif(p_expense->>'exchange_rate','')::numeric, 1),
    (p_expense->>'amount_gtq')::numeric,
    nullif(p_expense->>'exchange_rate_source',''),
    nullif(p_expense->>'notes',''),
    'card', p_credit_card_id,
    (p_expense->>'statement_cutoff_date')::date,
    (p_expense->>'statement_due_date')::date
  );

  update public.deudas
  set initial_expense_id = v_expense_id,
      updated_at = now()
  where id = v_debt_id and user_id = v_user_id
  returning * into v_debt;

  return jsonb_build_object(
    'debt', to_jsonb(v_debt),
    'expense_id', v_expense_id
  );
end;
$$;

revoke all on function public.registrar_financiamiento_con_tarjeta(jsonb, jsonb, uuid) from public;
grant execute on function public.registrar_financiamiento_con_tarjeta(jsonb, jsonb, uuid) to authenticated;

commit;
