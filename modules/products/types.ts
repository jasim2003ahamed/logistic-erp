import { z } from 'zod';

export interface Product {
    id: string;
    name: string;
    sku: string | null;
    price: number;
    created_at: string;
}

export interface CreateProductFormValues {
    name: string;
    sku?: string | null;
    price: number;
}

export const createProductSchema = z.object({
    name: z.string().min(2, "Product name is required"),
    sku: z.string().nullable().optional(),
    price: z.coerce.number().min(0, "Price must be a positive number"),
});
