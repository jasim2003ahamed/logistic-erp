import { createClient } from '@/lib/supabase/client';
import { Payment, PendingInvoice, RecordPaymentFormValues } from './types';

export const collectionService = {
    getPendingInvoices: async () => {
        const supabase = createClient();

        // Fetch invoices that are not fully paid
        // We'll calculate balance by fetching payments too
        const { data: invoices, error: invError } = await supabase
            .from('invoices')
            .select(`
        *,
        customer:customers(name),
        payments:payments(amount)
      `)
            .neq('status', 'paid')
            .order('created_at', { ascending: false });

        if (invError) throw invError;

        const pendingInvoices = (invoices as any[]).map(inv => {
            const total_paid = inv.payments?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
            const balance_amount = Number(inv.total_amount) - total_paid;

            return {
                ...inv,
                total_paid,
                balance_amount
            } as PendingInvoice;
        });

        // Filter out edge cases where total_paid >= total_amount but status isn't updated yet
        return pendingInvoices.filter(inv => inv.balance_amount > 0);
    },

    getPaymentHistory: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('payments')
            .select(`
        *,
        invoice:invoices(invoice_number, customer:customers(name))
      `)
            .order('payment_date', { ascending: false });

        if (error) throw error;
        return data as Payment[];
    },

    recordPayment: async (values: RecordPaymentFormValues) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('payments')
            .insert({
                invoice_id: values.invoice_id,
                amount: values.amount,
                payment_mode: values.payment_mode,
                reference_number: values.reference_number,
                payment_date: values.payment_date,
                notes: values.notes
            })
            .select()
            .single();

        if (error) throw error;
        return data as Payment;
    }
};
