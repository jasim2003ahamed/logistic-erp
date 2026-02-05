-- Add min_stock_level to products
alter table products add column if not exists min_stock_level numeric default 5;

-- Stock Items Table (Current level tracking)
create table if not exists stock_items (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade unique,
  quantity numeric default 0,
  updated_at timestamp with time zone default now()
);

-- RLS for stock_items
alter table stock_items enable row level security;
create policy "Enable all access for authenticated users" on stock_items for all using (true);

-- Function to handle stock deduction when invoice is paid
create or replace function public.handle_invoice_stock_deduction()
returns trigger as $$
begin
    -- If status changes to 'paid', deduct stock for all items
    if (new.status = 'paid' and old.status != 'paid') then
        update stock_items
        set quantity = quantity - items.quantity,
            updated_at = now()
        from (
            select product_id, sum(quantity) as quantity
            from invoice_items
            where invoice_id = new.id
            group by product_id
        ) as items
        where stock_items.product_id = items.product_id;
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- Trigger for invoice status change
drop trigger if exists on_invoice_paid_deduct_stock on invoices;
create trigger on_invoice_paid_deduct_stock
after update on invoices
for each row
execute function handle_invoice_stock_deduction();

-- Function to initialize stock row when product is created
create or replace function public.initialize_stock_for_product()
returns trigger as $$
begin
    insert into stock_items (product_id, quantity)
    values (new.id, 0)
    on conflict (product_id) do nothing;
    return new;
end;
$$ language plpgsql security definer;

-- Trigger for product creation
drop trigger if exists on_product_created_init_stock on products;
create trigger on_product_created_init_stock
after insert on products
for each row
execute function initialize_stock_for_product();
