import { createClient } from '@/lib/supabase/client';
import { CreateReleaseOrderFormValues, ReleaseOrder, ReleaseOrderStatus } from './types';
import { invoiceService } from '../invoices/services';

export const releaseOrderService = {
    getReleaseOrders: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('release_orders')
            .select(`
        *,
        invoice:invoices(invoice_number, customer:customers(company_name))
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as ReleaseOrder[];
    },

    getReleaseOrderById: async (id: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('release_orders')
            .select(`
        *,
        invoice:invoices(*, customer:customers(*)),
        items:release_order_items(*)
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as ReleaseOrder;
    },

    createReleaseOrder: async (values: CreateReleaseOrderFormValues) => {
        const supabase = createClient();

        // 1. Create Release Order
        const { data: releaseOrder, error: roError } = await supabase
            .from('release_orders')
            .insert({
                invoice_id: values.invoice_id,
                status: values.status,
                notes: values.notes
            })
            .select()
            .single();

        if (roError) throw roError;

        // 2. Create Items
        const itemsToInsert = values.items.map(item => ({
            release_order_id: releaseOrder.id,
            product_id: item.product_id,
            description: item.description,
            quantity: item.quantity
        }));

        const { error: itemsError } = await supabase
            .from('release_order_items')
            .insert(itemsToInsert);

        if (itemsError) throw itemsError;

        return releaseOrder;
    },

    updateStatus: async (id: string, status: ReleaseOrderStatus) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('release_orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },

    generateFromInvoice: async (invoiceId: string) => {
        // Fetch invoice with items
        const invoice = await invoiceService.getInvoiceById(invoiceId);
        if (!invoice) throw new Error("Invoice not found");

        const initialValues: CreateReleaseOrderFormValues = {
            invoice_id: invoice.id,
            status: 'pending',
            notes: `Generated from Invoice #${invoice.invoice_number}`,
            items: invoice.items?.map(item => ({
                product_id: item.product_id || undefined,
                description: item.description,
                quantity: item.quantity
            })) || []
        };

        return initialValues;
    }
};
