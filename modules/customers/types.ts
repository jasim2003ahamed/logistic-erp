import { z } from 'zod';

export interface Customer {
    id: string;
    company_name: string;
    company_email: string | null;
    attend_name: string | null;
    address: string | null;
    phone: string | null;
    uen: string | null;
    created_at: string;
}

export const createCustomerSchema = z.object({
    company_name: z.string().min(2, "Company name must be at least 2 characters"),
    company_email: z.string().email("Invalid email address").nullable().optional().or(z.literal('')),
    attend_name: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    uen: z.string().nullable().optional(),
});

export type CreateCustomerFormValues = z.infer<typeof createCustomerSchema>;
