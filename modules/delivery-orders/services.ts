import { createClient } from '@/lib/supabase/client';
import { CreateDeliveryOrderFormValues, DeliveryOrder, DeliveryOrderStatus } from './types';

export const deliveryOrderService = {
    getDeliveryOrders: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('delivery_orders')
            .select(`
        *,
        release_order:release_orders(
          release_number,
          invoice:invoices(invoice_number, customer:customers(name))
        )
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as DeliveryOrder[];
    },

    getDeliveryOrderById: async (id: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('delivery_orders')
            .select(`
        *,
        release_order:release_orders(
          *,
          invoice:invoices(*, customer:customers(*)),
          items:release_order_items(*)
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as DeliveryOrder;
    },

    createDeliveryOrder: async (values: CreateDeliveryOrderFormValues) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('delivery_orders')
            .insert(values)
            .select()
            .single();

        if (error) throw error;
        return data as DeliveryOrder;
    },

    updateStatus: async (id: string, status: DeliveryOrderStatus) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('delivery_orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },

    generateFromReleaseOrder: async (roId: string) => {
        // Note: This mostly just returns default values and links the RO
        const initialValues: Partial<CreateDeliveryOrderFormValues> = {
            release_order_id: roId,
            status: 'dispatched',
            delivery_date: new Date().toISOString().split('T')[0],
        };
        return initialValues;
    }
};
