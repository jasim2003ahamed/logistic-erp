import { z } from 'zod';
import { Customer, Product } from '../quotations/types';

// --- Database Types ---

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
    id: string;
    invoice_number: string;
    job_number: string | null;
    customer_id: string;
    quotation_id: string | null;
    parent_invoice_id: string | null;
    status: InvoiceStatus;
    issue_date: string; // YYYY-MM-DD
    due_date: string | null; // YYYY-MM-DD
    terms: string | null;
    currency: string;

    // Mode of Service
    service_modes: string[];

    // Shipment Details
    shipment_type: string | null;
    hbl_hawb: string | null;
    mbl_mawb: string | null;
    vessel_flight: string | null;
    voyage_no: string | null;
    pol: string | null;
    pod: string | null;
    vessel_pod: string | null;
    delivery_address: string | null;
    pickup_address: string | null;
    etd: string | null;
    eta: string | null;
    commodity: string | null;
    hs_code: string | null;
    num_packages: string | null;
    gross_weight: string | null;
    volume: string | null;
    container_type: string | null;
    temperature: string | null;

    // Vessel Supply Specific
    imo_no: string | null;
    berth_anchorage: string | null;
    vessel_delivery_date: string | null;

    total_amount: number;
    subtotal_amount: number;
    notes: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    customer?: Customer & { uen?: string };
    items?: InvoiceItem[];
}

export interface InvoiceItem {
    id: string;
    invoice_id: string;
    product_id: string | null;
    description: string;
    quantity: number;
    unit_price: number;
    currency: string;
    total_price: number;
}

// --- Zod Schemas ---

export const invoiceItemSchema = z.object({
    product_id: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unit_price: z.coerce.number().min(0, "Price must be positive"),
    currency: z.string().default('SGD'),
});

export const createInvoiceSchema = z.object({
    customer_id: z.string().min(1, "Customer is required"),
    invoice_number: z.string().optional(),
    job_number: z.string().optional(),
    quotation_id: z.string().optional(),
    parent_invoice_id: z.string().optional(),
    issue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    due_date: z.string().optional(),
    terms: z.string().optional(),
    currency: z.string().default('SGD'),

    // Mode of Service
    service_modes: z.array(z.string()).default([]),

    // Shipment Details
    shipment_type: z.string().optional(),
    hbl_hawb: z.string().optional(),
    mbl_mawb: z.string().optional(),
    vessel_flight: z.string().optional(),
    voyage_no: z.string().optional(),
    pol: z.string().optional(),
    pod: z.string().optional(),
    vessel_pod: z.string().optional(),
    delivery_address: z.string().optional(),
    pickup_address: z.string().optional(),
    etd: z.string().optional(),
    eta: z.string().optional(),
    commodity: z.string().optional(),
    hs_code: z.string().optional(),
    num_packages: z.string().optional(),
    gross_weight: z.string().optional(),
    volume: z.string().optional(),
    container_type: z.string().optional(),
    temperature: z.string().optional(),

    // Vessel Supply Specific
    imo_no: z.string().optional(),
    berth_anchorage: z.string().optional(),
    vessel_delivery_date: z.string().optional(),

    status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
    notes: z.string().optional(),
});

export type CreateInvoiceFormValues = z.infer<typeof createInvoiceSchema>;
