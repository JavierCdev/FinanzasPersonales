-- Registra una deuda y su gasto inicial en una sola transacción.
-- Los financiamientos vinculados a tarjeta usan registrar_financiamiento_con_tarjeta.
begin;

create or replace function public.registrar_deuda_con_gasto(
  p_debt jsonb,
  p_expense jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_debt_id text;
  v_expense_id text;
  v_category_id text;
  v_category_name text;
  v_debt public.deudas%rowtype;
begin
  if v_user_id is null then
    raise exception 'Debes iniciar sesión para registrar la deuda.';
  end if;

  v_debt_id := nullif(p_debt->>'id', '');
  v_expense_id := nullif(p_expense->>'id', '');
  v_category_id := nullif(p_expense->>'category_id', '');

  if v_debt_id is null or v_expense_id is null then
    raise exception 'No se pudieron generar los identificadores de la deuda y el gasto.';
  end if;
  if coalesce(p_debt->>'type','') not in ('loan','financing') then
    raise exception 'El tipo de deuda no es válido.';
  end if;
  if nullif(p_debt->>'name','') is null or nullif(p_debt->>'start_date','') is null then
    raise exception 'El nombre y la fecha de inicio son obligatorios.';
  end if;
  if coalesce((p_debt->>'original_amount')::numeric,0) <= 0
     or coalesce((p_debt->>'initial_balance')::numeric,0) <= 0
     or (p_debt->>'initial_balance')::numeric > (p_debt->>'original_amount')::numeric then
    raise exception 'Los montos de la deuda no son válidos.';
  end if;
  if coalesce((p_expense->>'amount')::numeric,0) <= 0
     or coalesce((p_expense->>'exchange_rate')::numeric,0) <= 0
     or coalesce((p_expense->>'amount_gtq')::numeric,0) <= 0 then
    raise exception 'El monto del gasto y el tipo de cambio deben ser válidos.';
  end if;
  if round((p_expense->>'amount')::numeric,2) <> round((p_debt->>'original_amount')::numeric,2) then
    raise exception 'El gasto inicial debe coincidir con el monto original de la deuda.';
  end if;
  if coalesce(p_expense->>'payment_method','cash') <> 'cash' then
    raise exception 'Este registro corresponde a un gasto desde efectivo o cuenta; para tarjeta utiliza la vinculación del financiamiento.';
  end if;

  select c.name into v_category_name
  from public.categorias c
  where c.id = v_category_id
    and c.type = 'expense'
    and c.active = true
    and (c.user_id is null or c.user_id = v_user_id);

  if not found then
    raise exception 'La categoría del gasto no existe o está inactiva.';
  end if;

  insert into public.deudas (
    id, user_id, type, name, institution, original_amount, initial_balance,
    current_balance, interest_rate, installment_amount, frequency,
    start_date, first_due_date, notes, is_active, currency,
    default_payment_method, default_credit_card_id, initial_expense_id
  ) values (
    v_debt_id, v_user_id, p_debt->>'type', p_debt->>'name',
    nullif(p_debt->>'institution',''),
    (p_debt->>'original_amount')::numeric,
    (p_debt->>'initial_balance')::numeric,
    (p_debt->>'current_balance')::numeric,
    coalesce(nullif(p_debt->>'interest_rate','')::numeric,0),
    coalesce(nullif(p_debt->>'installment_amount','')::numeric,0),
    coalesce(nullif(p_debt->>'frequency',''),'monthly'),
    (p_debt->>'start_date')::date,
    nullif(p_debt->>'first_due_date','')::date,
    coalesce(p_debt->>'notes',''),
    coalesce((p_debt->>'is_active')::boolean,true),
    coalesce(nullif(p_debt->>'currency',''),'GTQ'),
    coalesce(nullif(p_debt->>'default_payment_method',''),'cash'),
    nullif(p_debt->>'default_credit_card_id','')::uuid,
    null
  );

  insert into public.gastos (
    id, user_id, date, description, category_id, category_name,
    currency, amount, exchange_rate, amount_gtq, exchange_rate_source,
    notes, payment_method, credit_card_id, account_id
  ) values (
    v_expense_id, v_user_id, (p_expense->>'date')::date,
    p_expense->>'description', v_category_id, v_category_name,
    coalesce(nullif(p_expense->>'currency',''),'GTQ'),
    (p_expense->>'amount')::numeric,
    (p_expense->>'exchange_rate')::numeric,
    (p_expense->>'amount_gtq')::numeric,
    nullif(p_expense->>'exchange_rate_source',''),
    nullif(p_expense->>'notes',''),
    'cash', null, null
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

revoke all on function public.registrar_deuda_con_gasto(jsonb,jsonb) from public, anon;
grant execute on function public.registrar_deuda_con_gasto(jsonb,jsonb) to authenticated;

commit;
