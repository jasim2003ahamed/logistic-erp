'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { stockAdjustmentSchema, StockAdjustmentFormValues, ProductWithStock } from '../types';
import { useUpdateStock } from '../hooks/useStock';

interface StockAdjustmentModalProps {
    product: ProductWithStock;
    onClose: () => void;
}

export function StockAdjustmentModal({ product, onClose }: StockAdjustmentModalProps) {
    const updateStock = useUpdateStock();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<StockAdjustmentFormValues>({
        resolver: zodResolver(stockAdjustmentSchema) as any,
        defaultValues: {
            product_id: product.id,
            quantity: product.stock?.quantity || 0,
        },
    });

    const onSubmit = async (data: StockAdjustmentFormValues) => {
        try {
            await updateStock.mutateAsync(data);
            onClose();
        } catch (error) {
            console.error('Failed to update stock:', error);
            alert('Failed to update stock');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-all animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Adjust Stock</h2>
                        <p className="text-sm text-slate-500">{product.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            New Quantity
                        </label>
                        <Input
                            type="number"
                            min="0"
                            {...register('quantity')}
                            placeholder="Enter new stock level"
                            autoFocus
                        />
                        {errors.quantity && (
                            <p className="text-xs font-medium text-red-500">{errors.quantity.message}</p>
                        )}
                        <p className="text-xs text-slate-400">
                            Current stock: <span className="font-semibold">{product.stock?.quantity || 0}</span>
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
