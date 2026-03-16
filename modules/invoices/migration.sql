-- Migration to change invoice_number to text format
-- Run this in your Supabase SQL Editor

-- 1. Remove the serial default (sequence)
ALTER TABLE invoices ALTER COLUMN invoice_number DROP DEFAULT;

-- 2. Change column type to text
ALTER TABLE invoices ALTER COLUMN invoice_number TYPE text;

-- 3. Optional: Update existing numeric invoice numbers to the new format
-- This will format existing numbers like '1' to 'DUS-2026-0001'
-- Only run this if you want to convert old invoices.
-- UPDATE invoices 
-- SET invoice_number = 'DUS-' || EXTRACT(YEAR FROM created_at)::text || '-' || LPAD(invoice_number, 4, '0')
-- WHERE invoice_number ~ '^\d+$';

-- 4. Add vessel_pod column for Ship Spares
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS vessel_pod text;
