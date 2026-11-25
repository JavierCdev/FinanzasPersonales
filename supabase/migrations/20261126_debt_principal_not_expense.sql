-- Los préstamos y financiamientos representan una obligación, no un gasto de consumo.
-- El capital recibido no debe alterar Gastos, reportes ni saldos de cuentas/tarjetas.
begin;

create or replace function public.registrar_deuda_sin_gasto(p_debt jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_debt public.deudas%rowtype;
  v_debt_id text := nullif(p_debt->>'id','');
begin
  if v_user_id is null then raise exception 'Debes iniciar sesión para registrar la deuda.'; end if;
  if v_debt_id is null then raise exception 'No se pudo generar el identificador de la deuda.'; end if;
  if coalesce(p_debt->>'type','') not in ('loan','financing') then raise exception 'El tipo de deuda no es válido.'; end if;
  if nullif(p_debt->>'name','') is null or nullif(p_debt->>'start_date','') is null then raise exception 'El nombre y la fecha de inicio son obligatorios.'; end if;
  if coalesce((p_debt->>'original_amount')::numeric,0) <= 0
     or coalesce((p_debt->>'initial_balance')::numeric,0) <= 0
     or (p_debt->>'initial_balance')::numeric > (p_debt->>'original_amount')::numeric then
    raise exception 'Los montos de la deuda no son válidos.';
  end if;

  insert into public.deudas (
    id,user_id,type,name,institution,original_amount,initial_balance,current_balance,
    interest_rate,installment_amount,frequency,start_date,first_due_date,notes,
    is_active,currency,default_payment_method,default_credit_card_id,initial_expense_id
  ) values (
    v_debt_id,v_user_id,p_debt->>'type',p_debt->>'name',nullif(p_debt->>'institution',''),
    (p_debt->>'original_amount')::numeric,(p_debt->>'initial_balance')::numeric,
    (p_debt->>'current_balance')::numeric,coalesce(nullif(p_debt->>'interest_rate','')::numeric,0),
    coalesce(nullif(p_debt->>'installment_amount','')::numeric,0),
    coalesce(nullif(p_debt->>'frequency',''),'monthly'),(p_debt->>'start_date')::date,
    nullif(p_debt->>'first_due_date','')::date,coalesce(p_debt->>'notes',''),
    coalesce((p_debt->>'is_active')::boolean,true),coalesce(nullif(p_debt->>'currency',''),'GTQ'),
    coalesce(nullif(p_debt->>'default_payment_method',''),'cash'),
    nullif(p_debt->>'default_credit_card_id','')::uuid,null
  ) returning * into v_debt;

  return jsonb_build_object('debt',to_jsonb(v_debt));
end;
$$;

create or replace function public.registrar_financiamiento_sin_compra(
  p_debt jsonb,
  p_credit_card_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_card public.tarjetas_credito%rowtype;
  v_debt public.deudas%rowtype;
  v_debt_id text := nullif(p_debt->>'id','');
begin
  if v_user_id is null then raise exception 'Debes iniciar sesión para registrar el financiamiento.'; end if;
  if coalesce(p_debt->>'type','') <> 'financing' then raise exception 'Esta operación solo permite financiamientos.'; end if;
  if v_debt_id is null then raise exception 'No se pudo generar el identificador del financiamiento.'; end if;
  select * into v_card from public.tarjetas_credito
  where id=p_credit_card_id and user_id=v_user_id and active=true;
  if not found then raise exception 'La tarjeta seleccionada no existe o está inactiva.'; end if;
  insert into public.deudas (
    id,user_id,type,name,institution,original_amount,initial_balance,current_balance,
    interest_rate,installment_amount,frequency,start_date,first_due_date,notes,
    is_active,currency,default_payment_method,default_credit_card_id,credit_card_id,initial_expense_id
  ) values (
    v_debt_id,v_user_id,'financing',p_debt->>'name',nullif(p_debt->>'institution',''),
    (p_debt->>'original_amount')::numeric,(p_debt->>'initial_balance')::numeric,
    (p_debt->>'current_balance')::numeric,coalesce(nullif(p_debt->>'interest_rate','')::numeric,0),
    coalesce(nullif(p_debt->>'installment_amount','')::numeric,0),
    coalesce(nullif(p_debt->>'frequency',''),'monthly'),(p_debt->>'start_date')::date,
    nullif(p_debt->>'first_due_date','')::date,coalesce(p_debt->>'notes',''),
    coalesce((p_debt->>'is_active')::boolean,true),coalesce(nullif(p_debt->>'currency',''),'GTQ'),
    coalesce(nullif(p_debt->>'default_payment_method',''),'cash'),
    nullif(p_debt->>'default_credit_card_id','')::uuid,p_credit_card_id,null
  ) returning * into v_debt;
  return jsonb_build_object('debt',to_jsonb(v_debt));
end;
$$;

revoke all on function public.registrar_deuda_sin_gasto(jsonb) from public,anon;
revoke all on function public.registrar_financiamiento_sin_compra(jsonb,uuid) from public,anon;
grant execute on function public.registrar_deuda_sin_gasto(jsonb) to authenticated;
grant execute on function public.registrar_financiamiento_sin_compra(jsonb,uuid) to authenticated;

commit;
