-- Delivery Orders Table
create table if not exists delivery_orders (
  id uuid default gen_random_uuid() primary key,
  delivery_number serial,
  release_order_id uuid references release_orders(id) on delete set null,
  driver_name text not null,
  vehicle_number text not null,
  delivery_date date not null,
  status text check (status in ('dispatched', 'delivered')) default 'dispatched',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS Policies
alter table delivery_orders enable row level security;
create policy "Enable all access for authenticated users" on delivery_orders for all using (true);
