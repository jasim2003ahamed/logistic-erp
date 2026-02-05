import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockService } from '../services';
import { StockAdjustmentFormValues, ProductStockFormValues } from '../types';

export function useStock() {
    return useQuery({
        queryKey: ['stocks'],
        queryFn: stockService.getStocks,
    });
}

export function useLowStockItems() {
    return useQuery({
        queryKey: ['low-stock'],
        queryFn: stockService.getLowStockItems,
    });
}

export function useUpdateStock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: StockAdjustmentFormValues) => stockService.updateStockLevel(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stocks'] });
            queryClient.invalidateQueries({ queryKey: ['low-stock'] });
        },
    });
}

export function useCreateProductWithStock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: ProductStockFormValues) => stockService.createProductWithStock(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stocks'] });
            queryClient.invalidateQueries({ queryKey: ['products'] }); // Invalidate global products list too
        },
    });
}

export function useUpdateProductStockSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, values }: { id: string, values: ProductStockFormValues }) =>
            stockService.updateProductStockSettings(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stocks'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}
