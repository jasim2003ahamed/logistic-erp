'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createQuotationSchema, CreateQuotationFormValues } from '../types';
import { useCreateQuotation, useCustomers, useProducts, useQuotation, useUpdateQuotation } from '../hooks/useQuotations';

interface QuotationFormProps {
    id?: string;
}

export function QuotationForm({ id }: QuotationFormProps) {
    const { data: customers } = useCustomers();
    const { data: products } = useProducts();
    const { mutate: createQuotation, isPending: isCreating } = useCreateQuotation();
    const { mutate: updateQuotation, isPending: isUpdating } = useUpdateQuotation();
    const { data: existingQuotation, isLoading: isQuotationLoading } = useQuotation(id || '');

    const form = useForm<CreateQuotationFormValues>({
        resolver: zodResolver(createQuotationSchema),
        defaultValues: {
            items: [{ product_id: '', quantity: 1, unit_price: 0 }],
        },
    });

    useEffect(() => {
        if (existingQuotation) {
            form.reset({
                customer_id: existingQuotation.customer_id,
                valid_until: existingQuotation.valid_until || undefined,
                items: existingQuotation.items?.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price
                })) || []
            });
        }
    }, [existingQuotation, form]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    // Watch items to update prices and totals
    const watchItems = form.watch('items');

    // Auto-fill price when product changes
    useEffect(() => {
        watchItems.forEach((item, index) => {
            if (item.product_id && products) {
                const product = products.find((p) => p.id === item.product_id);
                // Only update if price is 0 (initial) to allow manual override, or force update? 
                // For now, let's force update if the user just selected the product.
                // A better approach tracks "active" field changes, but this is simple MVP.
                if (product && item.unit_price === 0) {
                    form.setValue(`items.${index}.unit_price`, product.price);
                }
            }
        });
    }, [JSON.stringify(watchItems.map(i => i.product_id)), products, form]);

    const grandTotal = watchItems.reduce((acc, item) => {
        return acc + (item.quantity * item.unit_price || 0);
    }, 0);

    const onSubmit = (data: CreateQuotationFormValues) => {
        if (id) {
            updateQuotation({ id, data });
        } else {
            createQuotation(data);
        }
    };

    if (id && isQuotationLoading) return <div>Loading quotation...</div>;

    const isPending = isCreating || isUpdating;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/quotations/list">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">{id ? 'Edit Quotation' : 'New Quotation'}</h1>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* ... rest of form stays similar ... */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Customer</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                    {...form.register('customer_id')}
                                >
                                    <option value="">Select a customer...</option>
                                    {customers?.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.company_name}
                                        </option>
                                    ))}
                                </select>
                                {form.formState.errors.customer_id && (
                                    <p className="text-sm text-red-500">{form.formState.errors.customer_id.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Valid Until</label>
                                <Input type="date" {...form.register('valid_until')} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Order Items</CardTitle>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => append({ product_id: '', quantity: 1, unit_price: 0 })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium">Product</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                        {...form.register(`items.${index}.product_id`)}
                                    >
                                        <option value="">Select Product...</option>
                                        {products?.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-24 space-y-2">
                                    <label className="text-sm font-medium">Qty</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                    />
                                </div>

                                <div className="w-32 space-y-2">
                                    <label className="text-sm font-medium">Price</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...form.register(`items.${index}.unit_price`, { valueAsNumber: true })}
                                    />
                                </div>

                                <div className="w-32 space-y-2">
                                    <label className="text-sm font-medium">Total</label>
                                    <div className="flex h-10 w-full items-center rounded-md border border-slate-100 bg-slate-50 px-3 text-sm text-slate-500">
                                        {((Number(watchItems[index]?.quantity) || 0) * (Number(watchItems[index]?.unit_price) || 0)).toFixed(2)}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="mb-[2px]"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        {form.formState.errors.items && (
                            <p className="text-sm text-red-500">{form.formState.errors.items.message}</p>
                        )}

                        <div className="flex justify-end pt-4">
                            <div className="text-2xl font-bold">
                                Grand Total: ${grandTotal.toFixed(2)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isPending}>
                        {isPending ? 'Saving...' : id ? 'Update Quotation' : 'Create Quotation'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
