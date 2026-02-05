import { z } from 'zod';
import { Invoice } from '../invoices/types';

export type PaymentMode = 'cash' | 'upi' | 'bank_transfer';

export interface Payment {
    id: string;
    invoice_id: string;
    amount: number;
    payment_mode: PaymentMode;
    reference_number: string | null;
    payment_date: string;
    notes: string | null;
    created_at: string;

    // Relations
    invoice?: Invoice;
}

export interface PendingInvoice extends Invoice {
    total_paid: number;
    balance_amount: number;
}

// --- Zod Schemas ---

export const recordPaymentSchema = z.object({
    invoice_id: z.string().min(1, "Invoice is required"),
    amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
    payment_mode: z.enum(['cash', 'upi', 'bank_transfer']),
    reference_number: z.string().optional(),
    payment_date: z.string().min(1, "Payment date is required"),
    notes: z.string().optional(),
});

export type RecordPaymentFormValues = z.infer<typeof recordPaymentSchema>;
