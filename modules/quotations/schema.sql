-- Enable RLS
alter table if exists customers enable row level security;
alter table if exists products enable row level security;
alter table if exists quotations enable row level security;
alter table if exists quotation_items enable row level security;

-- Customers Table
create table if not exists customers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  address text,
  created_at timestamp with time zone default now()
);

-- Products Table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  sku text,
  price numeric not null,
  created_at timestamp with time zone default now()
);

-- Quotations Table
create table if not exists quotations (
  id uuid default gen_random_uuid() primary key,
  quotation_number serial,
  customer_id uuid references customers(id),
  status text check (status in ('draft', 'sent', 'approved', 'rejected')) default 'draft',
  total_amount numeric default 0,
  valid_until date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Quotation Items Table
create table if not exists quotation_items (
  id uuid default gen_random_uuid() primary key,
  quotation_id uuid references quotations(id) on delete cascade,
  product_id uuid references products(id),
  quantity numeric default 1,
  unit_price numeric not null,
  total_price numeric not null,
  created_at timestamp with time zone default now()
);

-- RLS Policies (Allow all for now, can be restricted later)
create policy "Enable all access for authenticated users" on customers for all using (true);
create policy "Enable all access for authenticated users" on products for all using (true);
create policy "Enable all access for authenticated users" on quotations for all using (true);
create policy "Enable all access for authenticated users" on quotation_items for all using (true);
