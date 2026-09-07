-- Pegar en Supabase → SQL Editor → Run

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null,
  icon text not null,
  is_seed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete restrict,
  title text not null,
  amount numeric(12, 2) not null,
  type text not null check (type in ('expense', 'income')),
  payment_method text not null check (payment_method in ('credit', 'debit', 'cash')),
  date date not null,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories (user_id);
create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_category_id_idx on public.transactions (category_id);
create index if not exists transactions_date_idx on public.transactions (user_id, date desc);

alter table public.categories enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "categories_select" on public.categories;
drop policy if exists "categories_insert" on public.categories;
drop policy if exists "categories_update" on public.categories;
drop policy if exists "categories_delete" on public.categories;
drop policy if exists "transactions_select" on public.transactions;
drop policy if exists "transactions_insert" on public.transactions;
drop policy if exists "transactions_update" on public.transactions;
drop policy if exists "transactions_delete" on public.transactions;

create policy "categories_select" on public.categories
  for select to authenticated
  using (user_id = auth.uid());

create policy "categories_insert" on public.categories
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "categories_update" on public.categories
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "categories_delete" on public.categories
  for delete to authenticated
  using (user_id = auth.uid());

create policy "transactions_select" on public.transactions
  for select to authenticated
  using (user_id = auth.uid());

create policy "transactions_insert" on public.transactions
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "transactions_update" on public.transactions
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "transactions_delete" on public.transactions
  for delete to authenticated
  using (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.categories (user_id, name, color, icon, is_seed)
  values
    (new.id, 'Comida', '#3f3f46', 'utensils', true),
    (new.id, 'Transporte', '#3f3f46', 'car', true),
    (new.id, 'Hogar', '#3f3f46', 'house', true),
    (new.id, 'Compras', '#3f3f46', 'shoppingBag', true),
    (new.id, 'Salud', '#3f3f46', 'heartPulse', true),
    (new.id, 'Ingresos', '#3f3f46', 'wallet', true);

  return new;
end;
$$;

grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
