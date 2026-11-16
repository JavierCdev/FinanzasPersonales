-- Agrega la moneda de origen a préstamos y financiamientos.
alter table public.deudas
add column if not exists currency text not null default 'GTQ';

alter table public.deudas
drop constraint if exists deudas_currency_check;

alter table public.deudas
add constraint deudas_currency_check
check (currency in ('GTQ', 'USD'));
