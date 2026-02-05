-- Release Orders Table
create table if not exists release_orders (
  id uuid default gen_random_uuid() primary key,
  release_number serial,
  invoice_id uuid references invoices(id) on delete set null,
  status text check (status in ('pending', 'released')) default 'pending',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Release Order Items Table
create table if not exists release_order_items (
  id uuid default gen_random_uuid() primary key,
  release_order_id uuid references release_orders(id) on delete cascade not null,
  product_id uuid references products(id),
  description text not null,
  quantity numeric not null,
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table release_orders enable row level security;
alter table release_order_items enable row level security;

create policy "Enable all access for authenticated users" on release_orders for all using (true);
create policy "Enable all access for authenticated users" on release_order_items for all using (true);
