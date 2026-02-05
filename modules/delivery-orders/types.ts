import { z } from 'zod';
import { ReleaseOrder } from '../release-orders/types';

export type DeliveryOrderStatus = 'dispatched' | 'delivered';

export interface DeliveryOrder {
    id: string;
    delivery_number: number;
    release_order_id: string | null;
    driver_name: string;
    vehicle_number: string;
    delivery_date: string; // YYYY-MM-DD
    status: DeliveryOrderStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    release_order?: ReleaseOrder;
}

// --- Zod Schemas ---

export const createDeliveryOrderSchema = z.object({
    release_order_id: z.string().optional(),
    driver_name: z.string().min(1, "Driver name is required"),
    vehicle_number: z.string().min(1, "Vehicle number is required"),
    delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    status: z.enum(['dispatched', 'delivered']).default('dispatched'),
    notes: z.string().optional(),
});

export type CreateDeliveryOrderFormValues = z.infer<typeof createDeliveryOrderSchema>;
