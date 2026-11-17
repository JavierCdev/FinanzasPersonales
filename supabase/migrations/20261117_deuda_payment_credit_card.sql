-- Registra un abono de préstamo financiado con tarjeta como compra de tarjeta.
-- El gasto alimenta el estado de cuenta existente; el saldo del préstamo baja por capital.
begin;

create or replace function public.registrar_pago_deuda_con_tarjeta(
  p_payment_id text,
  p_expense_id text,
  p_debt_id text,
  p_payment_date date,
  p_principal_amount numeric,
  p_interest_amount numeric,
  p_charges_amount numeric,
  p_total_amount numeric,
  p_category_id text,
  p_currency text,
  p_amount numeric,
  p_exchange_rate numeric,
  p_amount_gtq numeric,
  p_credit_card_id uuid,
  p_statement_cutoff_date date,
  p_statement_due_date date,
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_debt public.deudas%rowtype;
  v_card public.tarjetas_credito%rowtype;
  v_previous_balance numeric(14,2);
  v_new_balance numeric(14,2);
begin
  if v_user_id is null then
    raise exception 'Debes iniciar sesión para registrar el pago.';
  end if;

  if coalesce(trim(p_payment_id), '') = '' or coalesce(trim(p_expense_id), '') = '' then
    raise exception 'Los identificadores del pago y gasto son obligatorios.';
  end if;
  if p_payment_date is null or p_amount is null or p_amount <= 0
     or p_exchange_rate is null or p_exchange_rate <= 0
     or p_amount_gtq is null or p_amount_gtq <= 0 then
    raise exception 'La fecha, el monto y el tipo de cambio deben ser válidos.';
  end if;
  if p_principal_amount is null or p_principal_amount <= 0
     or coalesce(p_interest_amount,0) < 0 or coalesce(p_charges_amount,0) < 0
     or round(p_total_amount,2) <> round(p_principal_amount + coalesce(p_interest_amount,0) + coalesce(p_charges_amount,0),2)
     or round(p_amount,2) <> round(p_total_amount,2) then
    raise exception 'La distribución del pago no coincide con el total.';
  end if;
  if p_statement_cutoff_date is null or p_statement_due_date is null then
    raise exception 'La tarjeta necesita fechas de corte y pago.';
  end if;

  select * into v_debt
  from public.deudas
  where id = p_debt_id and user_id = v_user_id
  for update;

  if not found then raise exception 'No se encontró la deuda.'; end if;
  if not v_debt.is_active then raise exception 'La deuda ya está liquidada.'; end if;
  if v_debt.currency <> p_currency then raise exception 'La moneda del pago no coincide con la deuda.'; end if;

  v_previous_balance := v_debt.current_balance;
  if p_principal_amount > v_previous_balance then
    raise exception 'El abono a capital supera el saldo pendiente.';
  end if;

  select * into v_card
  from public.tarjetas_credito
  where id = p_credit_card_id and user_id = v_user_id and active = true;

  if not found then raise exception 'La tarjeta no existe o está inactiva.'; end if;

  if not exists (
    select 1 from public.categorias
    where id = p_category_id and type = 'expense' and active = true
      and (user_id is null or user_id = v_user_id)
  ) then raise exception 'Selecciona una categoría de gasto válida.'; end if;

  if exists (select 1 from public.deuda_pagos where id = p_payment_id or expense_id = p_expense_id) then
    raise exception 'Este pago ya fue registrado.';
  end if;

  insert into public.gastos (
    id, user_id, date, description, category_id, category_name,
    currency, amount, exchange_rate, amount_gtq, exchange_rate_source,
    notes, payment_method, credit_card_id, statement_cutoff_date,
    statement_due_date, account_id
  )
  select
    p_expense_id, v_user_id, p_payment_date,
    'Pago de deuda: ' || v_debt.name, c.id, c.name,
    p_currency, p_amount, p_exchange_rate, p_amount_gtq,
    case when p_currency = 'USD' then 'Manual' else 'N/A' end,
    coalesce(p_notes,''), 'card', p_credit_card_id,
    p_statement_cutoff_date, p_statement_due_date, null
  from public.categorias c
  where c.id = p_category_id;

  insert into public.deuda_pagos (
    id, user_id, debt_id, payment_date, principal_amount,
    interest_amount, charges_amount, total_amount, expense_id, notes
  ) values (
    p_payment_id, v_user_id, p_debt_id, p_payment_date, p_principal_amount,
    coalesce(p_interest_amount,0), coalesce(p_charges_amount,0),
    p_total_amount, p_expense_id, coalesce(p_notes,'')
  );

  v_new_balance := round(v_previous_balance - p_principal_amount, 2);
  update public.deudas
  set current_balance = v_new_balance,
      is_active = v_new_balance > 0,
      updated_at = now()
  where id = p_debt_id and user_id = v_user_id;

  return jsonb_build_object(
    'success', true, 'payment_id', p_payment_id, 'expense_id', p_expense_id,
    'debt_id', p_debt_id, 'previous_balance', v_previous_balance,
    'new_balance', v_new_balance, 'credit_card_id', p_credit_card_id
  );
end;
$$;

revoke all on function public.registrar_pago_deuda_con_tarjeta(text,text,text,date,numeric,numeric,numeric,numeric,text,text,numeric,numeric,numeric,uuid,date,date,text) from public, anon;
grant execute on function public.registrar_pago_deuda_con_tarjeta(text,text,text,date,numeric,numeric,numeric,numeric,text,text,numeric,numeric,numeric,uuid,date,date,text) to authenticated;

commit;
