'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services';
import { createProductSchema, CreateProductFormValues, Product } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ProductFormProps {
    initialData?: Product;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
    const queryClient = useQueryClient();

    const form = useForm<CreateProductFormValues>({
        resolver: zodResolver(createProductSchema) as any,
        defaultValues: initialData ? {
            name: initialData.name,
            sku: initialData.sku || '',
            price: Number(initialData.price),
        } : {
            name: '',
            sku: '',
            price: 0,
        },
    });

    const mutation = useMutation({
        mutationFn: (values: CreateProductFormValues) =>
            initialData
                ? productService.updateProduct(initialData.id, values)
                : productService.createProduct(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(initialData ? 'Product updated successfully' : 'Product registered successfully');
            onSuccess?.();
        },
        onError: (error: any) => {
            const message = error?.message || `Failed to ${initialData ? 'update' : 'register'} product`;
            toast.error(`Error: ${message}`);
        },
    });

    const onSubmit: SubmitHandler<CreateProductFormValues> = (values) => {
        const payload = {
            ...values,
            sku: values.sku?.trim() || null,
        };
        mutation.mutate(payload);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Product Name</label>
                <Input
                    {...form.register('name')}
                    placeholder="Enter product name"
                    className="focus-visible:ring-slate-400"
                />
                {form.formState.errors.name && (
                    <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">SKU</label>
                    <Input
                        {...form.register('sku')}
                        placeholder="SKU-XXX"
                        className="focus-visible:ring-slate-400"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Price (INR)</label>
                    <Input
                        {...form.register('price')}
                        type="number"
                        placeholder="0.00"
                        className="focus-visible:ring-slate-400"
                    />
                    {form.formState.errors.price && (
                        <p className="text-xs text-red-500">{form.formState.errors.price.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={mutation.isPending}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : initialData ? 'Update Product' : 'Register Product'}
                </Button>
            </div>
        </form>
    );
}

