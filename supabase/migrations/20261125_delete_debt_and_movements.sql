-- Elimina una deuda y exclusivamente los movimientos asociados a ella.
begin;
create or replace function public.eliminar_deuda_y_movimientos(p_debt_id text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_debt public.deudas%rowtype;
  v_payment_expense_ids text[];
  v_payment_count integer := 0;
  v_expense_count integer := 0;
begin
  if v_user_id is null then raise exception 'Debes iniciar sesión para eliminar la deuda.'; end if;
  select * into v_debt from public.deudas
  where id = p_debt_id and user_id = v_user_id for update;
  if not found then raise exception 'No se encontró la deuda o no tienes permiso para eliminarla.'; end if;

  select coalesce(array_agg(expense_id) filter (where expense_id is not null), array[]::text[])
  into v_payment_expense_ids
  from public.deuda_pagos where debt_id = p_debt_id and user_id = v_user_id;

  delete from public.deuda_pagos where debt_id = p_debt_id and user_id = v_user_id;
  get diagnostics v_payment_count = row_count;

  delete from public.gastos
  where user_id = v_user_id and (id = v_debt.initial_expense_id or id = any(v_payment_expense_ids));
  get diagnostics v_expense_count = row_count;

  delete from public.deudas where id = p_debt_id and user_id = v_user_id;
  return jsonb_build_object('success', true, 'debt_id', p_debt_id,
    'deleted_payments', v_payment_count, 'deleted_expenses', v_expense_count);
end;
$$;
revoke all on function public.eliminar_deuda_y_movimientos(text) from public, anon;
grant execute on function public.eliminar_deuda_y_movimientos(text) to authenticated;
commit;
