import { z } from 'zod';
import { Product } from '../quotations/types';

export interface StockItem {
    id: string;
    product_id: string;
    quantity: number;
    updated_at: string;
}

export interface ProductWithStock extends Product {
    min_stock_level: number;
    stock?: StockItem;
}

// --- Zod Schemas ---

export const stockAdjustmentSchema = z.object({
    product_id: z.string().min(1, "Product is required"),
    quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
});

export type StockAdjustmentFormValues = z.infer<typeof stockAdjustmentSchema>;

export const productStockSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sku: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be positive"),
    min_stock_level: z.coerce.number().min(0, "Min stock level cannot be negative"),
});

export type ProductStockFormValues = z.infer<typeof productStockSchema>;
