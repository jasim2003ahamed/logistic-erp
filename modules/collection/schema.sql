-- Payments Table
create table if not exists payments (
  id uuid default gen_random_uuid() primary key,
  invoice_id uuid references invoices(id) on delete cascade not null,
  amount numeric not null check (amount > 0),
  payment_mode text not null check (payment_mode in ('cash', 'upi', 'bank_transfer')),
  reference_number text,
  payment_date timestamp with time zone default now(),
  notes text,
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table payments enable row level security;
create policy "Enable all access for authenticated users" on payments for all using (true);

-- Function to update invoice status based on payments
create or replace function public.handle_invoice_payment_status()
returns trigger as $$
declare
    total_paid numeric;
    invoice_total numeric;
begin
    -- Get total paid for this invoice
    select coalesce(sum(amount), 0) into total_paid
    from payments
    where invoice_id = new.invoice_id;

    -- Get invoice total
    select total_amount into invoice_total
    from invoices
    where id = new.invoice_id;

    -- Update invoice status
    if total_paid >= invoice_total then
        update invoices set status = 'paid' where id = new.invoice_id;
    elsif total_paid > 0 then
        -- We might need a 'partially_paid' status if the system supports it, 
        -- but for now let's stick to the prompt's logic or 'pending'
        update invoices set status = 'pending' where id = new.invoice_id;
    end if;

    return new;
end;
$$ language plpgsql security definer;

-- Trigger for payment insertion
drop trigger if exists on_payment_inserted on payments;
create trigger on_payment_inserted
after insert on payments
for each row
execute function handle_invoice_payment_status();
