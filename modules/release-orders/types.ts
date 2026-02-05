import { z } from 'zod';
import { Invoice } from '../invoices/types';

export type ReleaseOrderStatus = 'pending' | 'released';

export interface ReleaseOrder {
    id: string;
    release_number: number;
    invoice_id: string | null;
    status: ReleaseOrderStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    invoice?: Invoice;
    items?: ReleaseOrderItem[];
}

export interface ReleaseOrderItem {
    id: string;
    release_order_id: string;
    product_id: string | null;
    description: string;
    quantity: number;
}

// --- Zod Schemas ---

export const releaseOrderItemSchema = z.object({
    product_id: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

export const createReleaseOrderSchema = z.object({
    invoice_id: z.string().optional(),
    status: z.enum(['pending', 'released']).default('pending'),
    notes: z.string().optional(),
    items: z.array(releaseOrderItemSchema).min(1, "At least one item is required"),
});

export type CreateReleaseOrderFormValues = z.infer<typeof createReleaseOrderSchema>;
