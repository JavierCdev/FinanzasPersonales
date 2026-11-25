-- Las cuotas pendientes no tienen una categoría de gasto hasta que se pagan.
-- La categoría se elige en registrar_pago_deuda_programado.
begin;

alter table public.gastos
    alter column category_id drop not null;

do $migration$
begin
    if not exists (
        select 1
        from pg_constraint
        where conrelid = 'public.gastos'::regclass
          and conname = 'gastos_paid_category_required'
    ) then
        alter table public.gastos
            add constraint gastos_paid_category_required
            check (
                (status = 'scheduled' and category_id is null)
                or (status <> 'scheduled' and category_id is not null)
            )
            not valid;
    end if;
end;
$migration$;

-- Retira de las 66 cuotas de prueba la referencia arbitraria a una categoría.
update public.gastos
set category_id = null,
    category_name = 'Cuota de deuda'
where status = 'scheduled';

alter table public.gastos
    validate constraint gastos_paid_category_required;

create or replace function public.generar_cuotas_programadas_deuda(p_debt_id text)
returns integer
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
    d public.deudas%rowtype;
    v_balance numeric(14,2);
    v_interest numeric(14,2);
    v_principal numeric(14,2);
    v_total numeric(14,2);
    v_date date;
    v_count integer := 0;
    v_periods numeric;
begin
    select * into d
    from public.deudas
    where id = p_debt_id and user_id = auth.uid()
    for update;

    if not found then
        raise exception 'No se encontró la deuda.';
    end if;
    if d.first_due_date is null or d.installment_amount <= 0 then
        return 0;
    end if;

    delete from public.gastos
    where debt_id = d.id and status = 'scheduled';

    v_balance := d.current_balance;
    v_date := d.first_due_date;
    v_periods := case d.frequency
        when 'weekly' then 52
        when 'biweekly' then 26
        when 'quarterly' then 4
        when 'yearly' then 1
        else 12
    end;

    while v_balance > 0.009 and v_count < 360 loop
        v_interest := round(v_balance * (coalesce(d.interest_rate, 0) / 100) / v_periods, 2);
        v_total := round(d.installment_amount, 2);
        v_principal := least(v_balance, greatest(0, v_total - v_interest));
        if v_principal <= 0 then
            exit;
        end if;

        insert into public.gastos (
            id, user_id, date, description, category_id, category_name, currency,
            amount, exchange_rate, amount_gtq, exchange_rate_source, notes,
            payment_method, status, debt_id, debt_installment_number,
            principal_amount, interest_amount, charges_amount
        ) values (
            'debt-schedule-' || d.id || '-' || (v_count + 1),
            d.user_id,
            v_date,
            'Cuota: ' || d.name,
            null,
            'Cuota de deuda',
            d.currency,
            v_principal + v_interest,
            1,
            v_principal + v_interest,
            'N/A',
            'Cuota programada; no contabilizada hasta el pago.',
            'scheduled',
            'scheduled',
            d.id,
            v_count + 1,
            v_principal,
            v_interest,
            0
        )
        on conflict (id) do update set
            date = excluded.date,
            category_name = excluded.category_name,
            amount = excluded.amount,
            amount_gtq = excluded.amount_gtq,
            principal_amount = excluded.principal_amount,
            interest_amount = excluded.interest_amount;

        v_balance := round(v_balance - v_principal, 2);
        v_count := v_count + 1;
        v_date := case d.frequency
            when 'weekly' then v_date + 7
            when 'biweekly' then v_date + 14
            when 'quarterly' then (v_date + interval '3 months')::date
            when 'yearly' then (v_date + interval '1 year')::date
            else (v_date + interval '1 month')::date
        end;
    end loop;

    return v_count;
end;
$$;

create or replace function public.registrar_pago_deuda_programado(
    p_payment_id text,
    p_debt_id text,
    p_scheduled_expense_id text,
    p_payment_date date,
    p_principal_amount numeric,
    p_interest_amount numeric,
    p_charges_amount numeric,
    p_total_amount numeric,
    p_category_id text,
    p_currency text,
    p_exchange_rate numeric,
    p_amount_gtq numeric,
    p_payment_method text,
    p_account_id text,
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
    v_user uuid := auth.uid();
    d public.deudas%rowtype;
    g public.gastos%rowtype;
    c public.categorias%rowtype;
    v_new_balance numeric(14,2);
begin
    if v_user is null then
        raise exception 'Debes iniciar sesión.';
    end if;

    select * into d
    from public.deudas
    where id = p_debt_id and user_id = v_user
    for update;
    if not found or not d.is_active then
        raise exception 'La deuda no está activa.';
    end if;

    select * into g
    from public.gastos
    where id = p_scheduled_expense_id
      and user_id = v_user
      and debt_id = p_debt_id
      and status = 'scheduled'
    for update;
    if not found then
        raise exception 'La cuota ya fue liquidada o no existe.';
    end if;

    select * into c
    from public.categorias
    where id = p_category_id
      and type = 'expense'
      and active = true
      and (user_id is null or user_id = v_user);
    if not found then
        raise exception 'Selecciona una categoría válida.';
    end if;

    if p_payment_id is null
       or p_payment_date is null
       or p_currency is distinct from d.currency
       or coalesce(p_principal_amount, 0) <= 0
       or p_principal_amount > d.current_balance
       or coalesce(p_interest_amount, 0) < 0
       or coalesce(p_charges_amount, 0) < 0
       or coalesce(p_total_amount, 0) <= 0
       or coalesce(p_exchange_rate, 0) <= 0
       or coalesce(p_amount_gtq, 0) <= 0
       or round(p_total_amount, 2) <> round(
            p_principal_amount + coalesce(p_interest_amount, 0) + coalesce(p_charges_amount, 0),
            2
       )
       or round(p_amount_gtq, 2) <> round(p_total_amount * p_exchange_rate, 2) then
        raise exception 'Los importes del pago no son válidos.';
    end if;

    if p_payment_method is null or p_payment_method not in ('cash', 'card') then
        raise exception 'Método de pago inválido.';
    end if;
    if p_payment_method = 'card' and (
        p_credit_card_id is null
        or p_statement_cutoff_date is null
        or p_statement_due_date is null
    ) then
        raise exception 'Selecciona tarjeta y fechas de estado de cuenta.';
    end if;
    if p_payment_method = 'card' and not exists (
        select 1 from public.tarjetas_credito
        where id = p_credit_card_id and user_id = v_user and active = true
    ) then
        raise exception 'La tarjeta no existe o está inactiva.';
    end if;
    if p_payment_method = 'cash'
       and p_account_id is not null
       and not exists (
            select 1 from public.cuentas_bancarias
            where id::text = p_account_id
              and user_id = v_user
              and currency = p_currency
       ) then
        raise exception 'La cuenta no es válida para la moneda del pago.';
    end if;
    if exists (
        select 1 from public.deuda_pagos
        where id = p_payment_id or expense_id = p_scheduled_expense_id
    ) then
        raise exception 'Este pago ya fue registrado.';
    end if;

    update public.gastos
    set date = p_payment_date,
        category_id = c.id,
        category_name = c.name,
        currency = p_currency,
        amount = p_total_amount,
        exchange_rate = p_exchange_rate,
        amount_gtq = p_amount_gtq,
        exchange_rate_source = case when p_currency = 'USD' then 'Manual' else 'N/A' end,
        notes = coalesce(p_notes, ''),
        payment_method = p_payment_method,
        account_id = case when p_payment_method = 'cash' then nullif(p_account_id, '')::uuid else null end,
        credit_card_id = case when p_payment_method = 'card' then p_credit_card_id else null end,
        statement_cutoff_date = case when p_payment_method = 'card' then p_statement_cutoff_date else null end,
        statement_due_date = case when p_payment_method = 'card' then p_statement_due_date else null end,
        status = 'paid',
        principal_amount = p_principal_amount,
        interest_amount = coalesce(p_interest_amount, 0),
        charges_amount = coalesce(p_charges_amount, 0)
    where id = p_scheduled_expense_id;

    insert into public.deuda_pagos (
        id, user_id, debt_id, payment_date, principal_amount,
        interest_amount, charges_amount, total_amount, expense_id, notes
    ) values (
        p_payment_id, v_user, p_debt_id, p_payment_date, p_principal_amount,
        coalesce(p_interest_amount, 0), coalesce(p_charges_amount, 0),
        p_total_amount, p_scheduled_expense_id, coalesce(p_notes, '')
    );

    v_new_balance := round(d.current_balance - p_principal_amount, 2);
    update public.deudas
    set current_balance = v_new_balance,
        is_active = v_new_balance > 0,
        updated_at = now()
    where id = p_debt_id and user_id = v_user;

    return jsonb_build_object(
        'success', true,
        'payment_id', p_payment_id,
        'expense_id', p_scheduled_expense_id,
        'new_balance', v_new_balance
    );
end;
$$;

revoke all on function public.registrar_pago_deuda_programado(
    text, text, text, date, numeric, numeric, numeric, numeric,
    text, text, numeric, numeric, text, text, uuid, date, date, text
) from public, anon;
grant execute on function public.registrar_pago_deuda_programado(
    text, text, text, date, numeric, numeric, numeric, numeric,
    text, text, numeric, numeric, text, text, uuid, date, date, text
) to authenticated;

commit;
