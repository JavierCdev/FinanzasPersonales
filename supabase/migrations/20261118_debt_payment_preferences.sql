-- Configuración predeterminada del método de pago por deuda.
begin;

alter table public.deudas
  add column if not exists default_payment_method text not null default 'cash',
  add column if not exists default_credit_card_id uuid;

alter table public.deudas
  drop constraint if exists deudas_default_payment_method_check;

alter table public.deudas
  add constraint deudas_default_payment_method_check
  check (default_payment_method in ('cash', 'bank', 'card'));

create index if not exists idx_deudas_default_credit_card
  on public.deudas(default_credit_card_id)
  where default_credit_card_id is not null;

commit;
