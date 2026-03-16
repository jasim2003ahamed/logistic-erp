import { createClient } from '@/lib/supabase/client';
import { Product, CreateProductFormValues } from './types';

export const productService = {
    async getProducts(): Promise<Product[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getProductById(id: string): Promise<Product> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async createProduct(product: CreateProductFormValues): Promise<Product> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateProduct(id: string, product: Partial<CreateProductFormValues>): Promise<Product> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .update(product)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteProduct(id: string): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
