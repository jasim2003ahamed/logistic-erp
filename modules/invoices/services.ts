import { createClient } from '@/lib/supabase/client';
import { CreateInvoiceFormValues, Invoice, InvoiceStatus } from './types';
import { quotationService } from '../quotations/services';

export const invoiceService = {
    // --- Invoices ---
    getInvoices: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('invoices')
            .select(`
        *,
        customer:customers(name)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Invoice[];
    },

    getInvoiceById: async (id: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('invoices')
            .select(`
        *,
        customer:customers(*),
        items:invoice_items(*),
        quotation:quotations(quotation_number) 
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Invoice;
    },

    createInvoice: async (formData: CreateInvoiceFormValues) => {
        const supabase = createClient();

        // 1. Calculate totals
        const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        const taxRate = formData.tax_rate || 0;
        const tax = (subtotal * taxRate) / 100;
        const total = subtotal + tax;

        // 2. Insert Invoice
        const { data: invoice, error: invError } = await supabase
            .from('invoices')
            .insert({
                customer_id: formData.customer_id,
                quotation_id: formData.quotation_id || null,
                issue_date: formData.issue_date,
                due_date: formData.due_date || null,
                status: formData.status,
                notes: formData.notes,
                subtotal_amount: subtotal,
                tax_rate: taxRate,
                tax_amount: tax,
                total_amount: total
            })
            .select()
            .single();

        if (invError) throw invError;

        // 3. Insert Items
        const itemsToInsert = formData.items.map(item => ({
            invoice_id: invoice.id,
            description: item.description,
            product_id: item.product_id || null,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price
        }));

        const { error: itemsError } = await supabase
            .from('invoice_items')
            .insert(itemsToInsert);

        if (itemsError) {
            console.error("Error creating invoice items", itemsError);
            throw itemsError;
        }

        return invoice;
    },

    generateFromQuotation: async (quotationId: string) => {
        // 1. Fetch Quotation
        const quotation = await quotationService.getQuotationById(quotationId);

        if (!quotation) throw new Error("Quotation not found");

        // 2. Map to Invoice Form Values
        // Note: We don't save DB immediately, we return form values for the user to review in "New Invoice" page
        const initialValues: Partial<CreateInvoiceFormValues> = {
            customer_id: quotation.customer_id,
            quotation_id: quotation.id,
            status: 'draft',
            issue_date: new Date().toISOString().split('T')[0],
            items: quotation.items?.map(item => ({
                product_id: item.product_id,
                description: item.product?.name || "Unknown Item", // We need product name here
                quantity: item.quantity,
                unit_price: item.unit_price
            })) || []
        };

        return initialValues;
    },

    updateStatus: async (id: string, status: InvoiceStatus) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('invoices')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    }
};
