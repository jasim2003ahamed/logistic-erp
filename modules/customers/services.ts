import { createClient } from '@/lib/supabase/client';
import { Customer, CreateCustomerFormValues } from './types';

export const customerService = {
    async getCustomers(): Promise<Customer[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getCustomerById(id: string): Promise<Customer> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async createCustomer(customer: CreateCustomerFormValues): Promise<Customer> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('customers')
            .insert([customer])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateCustomer(id: string, customer: Partial<CreateCustomerFormValues>): Promise<Customer> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('customers')
            .update(customer)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteCustomer(id: string): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
