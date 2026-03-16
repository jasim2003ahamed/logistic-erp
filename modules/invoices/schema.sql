-- Invoices Table
create table if not exists invoices (
  id uuid default gen_random_uuid() primary key,
  invoice_number serial,
  customer_id uuid references customers(id) not null,
  quotation_id uuid references quotations(id), -- Optional link to source quotation
  status text check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')) default 'draft',
  issue_date date default current_date,
  due_date date,
  total_amount numeric default 0,
  tax_amount numeric default 0,
  subtotal_amount numeric default 0,
  berth_anchorage text,
  vessel_delivery_date date,
  vessel_pod text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Invoice Items Table
create table if not exists invoice_items (
  id uuid default gen_random_uuid() primary key,
  invoice_id uuid references invoices(id) on delete cascade not null,
  product_id uuid references products(id), -- Optional, in case of custom items
  description text not null, -- Snapshot of product name or custom description
  quantity numeric default 1,
  unit_price numeric not null,
  total_price numeric not null,
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table invoices enable row level security;
alter table invoice_items enable row level security;

create policy "Enable all access for authenticated users" on invoices for all using (true);
create policy "Enable all access for authenticated users" on invoice_items for all using (true);
