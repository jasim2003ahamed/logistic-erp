import { z } from 'zod';
import { Customer, Product } from '../quotations/types';

// --- Database Types ---

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
    id: string;
    invoice_number: number;
    customer_id: string;
    quotation_id: string | null;
    status: InvoiceStatus;
    issue_date: string; // YYYY-MM-DD
    due_date: string | null; // YYYY-MM-DD
    total_amount: number;
    tax_amount: number;
    subtotal_amount: number;
    tax_rate: number; // e.g., 18 for 18%
    notes: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    customer?: Customer;
    items?: InvoiceItem[];
}

export interface InvoiceItem {
    id: string;
    invoice_id: string;
    product_id: string | null;
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

// --- Zod Schemas ---

export const invoiceItemSchema = z.object({
    product_id: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unit_price: z.coerce.number().min(0, "Price must be positive"),
});

export const createInvoiceSchema = z.object({
    customer_id: z.string().min(1, "Customer is required"),
    quotation_id: z.string().optional(),
    issue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    due_date: z.string().optional(),
    status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
    tax_rate: z.coerce.number().min(0).default(18), // Default to 18% GST
    notes: z.string().optional(),
});

export type CreateInvoiceFormValues = z.infer<typeof createInvoiceSchema>;
