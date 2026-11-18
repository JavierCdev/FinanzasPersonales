-- Permite importar pagos anteriores sin crear gastos duplicados.
begin;

create or replace function public.registrar_pago_historico_deuda(
  p_payment_id text,
  p_debt_id text,
  p_payment_date date,
  p_principal_amount numeric,
  p_interest_amount numeric default 0,
  p_charges_amount numeric default 0,
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
  v_total numeric(14,2);
  v_new_balance numeric(14,2);
begin
  if v_user_id is null then
    raise exception 'Debes iniciar sesión para registrar el pago.';
  end if;

  if coalesce(trim(p_payment_id), '') = '' or p_payment_date is null then
    raise exception 'El identificador y la fecha del pago son obligatorios.';
  end if;

  if p_principal_amount is null or p_principal_amount <= 0
     or coalesce(p_interest_amount, 0) < 0
     or coalesce(p_charges_amount, 0) < 0 then
    raise exception 'Los importes del pago no son válidos.';
  end if;

  select * into v_debt
  from public.deudas
  where id = p_debt_id and user_id = v_user_id
  for update;

  if not found then
    raise exception 'No se encontró la deuda.';
  end if;

  if p_payment_date < v_debt.start_date or p_payment_date > current_date then
    raise exception 'La fecha del pago debe estar entre el inicio de la deuda y hoy.';
  end if;

  if p_principal_amount > v_debt.current_balance then
    raise exception 'El abono a capital supera el saldo pendiente.';
  end if;

  if exists (select 1 from public.deuda_pagos where id = p_payment_id) then
    raise exception 'Este pago ya fue registrado.';
  end if;

  v_total := round(p_principal_amount + coalesce(p_interest_amount,0) + coalesce(p_charges_amount,0), 2);
  v_new_balance := round(v_debt.current_balance - p_principal_amount, 2);

  insert into public.deuda_pagos (
    id, user_id, debt_id, payment_date, principal_amount,
    interest_amount, charges_amount, total_amount, expense_id, notes
  ) values (
    p_payment_id, v_user_id, p_debt_id, p_payment_date,
    round(p_principal_amount,2), round(coalesce(p_interest_amount,0),2),
    round(coalesce(p_charges_amount,0),2), v_total, null,
    coalesce(p_notes,'Pago histórico importado; sin gasto nuevo.')
  );

  update public.deudas
  set current_balance = v_new_balance,
      is_active = v_new_balance > 0,
      updated_at = now()
  where id = p_debt_id and user_id = v_user_id;

  return jsonb_build_object(
    'success', true,
    'payment_id', p_payment_id,
    'debt_id', p_debt_id,
    'previous_balance', v_debt.current_balance,
    'new_balance', v_new_balance,
    'total_paid', v_total
  );
end;
$$;

revoke all on function public.registrar_pago_historico_deuda(text,text,date,numeric,numeric,numeric,text) from public, anon;
grant execute on function public.registrar_pago_historico_deuda(text,text,date,numeric,numeric,numeric,text) to authenticated;

commit;
