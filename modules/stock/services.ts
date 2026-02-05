import { createClient } from '@/lib/supabase/client';
import { ProductWithStock, StockAdjustmentFormValues, ProductStockFormValues } from './types';

export const stockService = {
    getStocks: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        stock:stock_items(*)
      `)
            .order('name');

        if (error) throw error;
        return data as ProductWithStock[];
    },

    updateStockLevel: async (values: StockAdjustmentFormValues) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('stock_items')
            .update({ quantity: values.quantity, updated_at: new Date().toISOString() })
            .eq('product_id', values.product_id);

        if (error) throw error;
    },

    createProductWithStock: async (values: ProductStockFormValues) => {
        const supabase = createClient();

        // 1. Create Product
        const { data: product, error: pError } = await supabase
            .from('products')
            .insert({
                name: values.name,
                sku: values.sku,
                price: values.price,
                min_stock_level: values.min_stock_level
            })
            .select()
            .single();

        if (pError) throw pError;

        // Trigger in DB (on_product_created_init_stock) will handle stock_items initialization
        return product;
    },

    updateProductStockSettings: async (id: string, values: ProductStockFormValues) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('products')
            .update({
                name: values.name,
                sku: values.sku,
                price: values.price,
                min_stock_level: values.min_stock_level
            })
            .eq('id', id);

        if (error) throw error;
    },

    getLowStockItems: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        stock:stock_items(*)
      `);

        if (error) throw error;

        const products = data as ProductWithStock[];
        return products.filter(p => (p.stock?.quantity || 0) < p.min_stock_level);
    }
};
