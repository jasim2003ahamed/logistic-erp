import { z } from 'zod';

import type { Customer } from '../customers/types';
import type { Product } from '../products/types';

export type { Customer, Product };

export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected';

export interface Quotation {
    id: string;
    quotation_number: number;
    customer_id: string;
    status: QuotationStatus;
    total_amount: number;
    valid_until: string | null;
    created_at: string;
    updated_at: string;
    // Joins
    customer?: Customer;
    items?: QuotationItem[];
}

export interface QuotationItem {
    id: string;
    quotation_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product?: Product;
}

// --- Zod Schemas for Forms ---

export const quotationItemSchema = z.object({
    product_id: z.string().min(1, "Product is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unit_price: z.number().min(0, "Price must be positive"),
});

export const createQuotationSchema = z.object({
    customer_id: z.string().min(1, "Customer is required"),
    valid_until: z.string().optional(), // Date string YYYY-MM-DD
    items: z.array(quotationItemSchema).min(1, "At least one item is required"),
});

export type CreateQuotationFormValues = z.infer<typeof createQuotationSchema>;
