import { createClient } from '@/lib/supabase/client';
import { CreateQuotationFormValues, Quotation, QuotationStatus } from './types';

export const quotationService = {
    // --- Customers & Products (Helpers) ---
    getCustomers: async () => {
        const supabase = createClient();
        const { data, error } = await supabase.from('customers').select('*').order('company_name');
        if (error) throw error;
        return data;
    },

    getProducts: async () => {
        const supabase = createClient();
        const { data, error } = await supabase.from('products').select('*').order('name');
        if (error) throw error;
        return data;
    },

    // --- Quotations ---
    getQuotations: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('quotations')
            .select(`
        *,
        customer:customers(company_name)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Quotation[];
    },

    getQuotationById: async (id: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('quotations')
            .select(`
        *,
        customer:customers(*),
        items:quotation_items(
          *,
          product:products(*)
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Quotation;
    },

    createQuotation: async (formData: CreateQuotationFormValues) => {
        const supabase = createClient();

        // 1. Calculate totals
        const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

        // 2. Insert Quotation
        const { data: quotation, error: qtError } = await supabase
            .from('quotations')
            .insert({
                customer_id: formData.customer_id,
                valid_until: formData.valid_until || null,
                total_amount: totalAmount,
                status: 'draft'
            })
            .select()
            .single();

        if (qtError) throw qtError;

        // 3. Insert Items
        const itemsToInsert = formData.items.map(item => ({
            quotation_id: quotation.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price
        }));

        const { error: itemsError } = await supabase
            .from('quotation_items')
            .insert(itemsToInsert);

        if (itemsError) {
            // Cleanup encryption if items fail? Realistically strictly transactional logic needs RPC or RLS magic, 
            // but for verified client-side simplicity:
            console.error("Error creating items", itemsError);
            throw itemsError;
        }

        return quotation;
    },

    updateStatus: async (id: string, status: QuotationStatus) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('quotations')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    },

    updateQuotation: async (id: string, formData: CreateQuotationFormValues) => {
        const supabase = createClient();

        // 1. Calculate totals
        const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

        // 2. Update Quotation
        const { data: quotation, error: qtError } = await supabase
            .from('quotations')
            .update({
                customer_id: formData.customer_id,
                valid_until: formData.valid_until || null,
                total_amount: totalAmount,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (qtError) throw qtError;

        // 3. Delete existing items
        const { error: deleteError } = await supabase
            .from('quotation_items')
            .delete()
            .eq('quotation_id', id);

        if (deleteError) throw deleteError;

        // 4. Insert new items
        const itemsToInsert = formData.items.map(item => ({
            quotation_id: id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price
        }));

        const { error: itemsError } = await supabase
            .from('quotation_items')
            .insert(itemsToInsert);

        if (itemsError) throw itemsError;

        return quotation;
    },

    deleteQuotation: async (id: string) => {
        const supabase = createClient();
        // quotation_items should be deleted via cascade if set up, 
        // but let's be safe if it's not.
        const { error: itemsError } = await supabase
            .from('quotation_items')
            .delete()
            .eq('quotation_id', id);

        if (itemsError) throw itemsError;

        const { error } = await supabase
            .from('quotations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
