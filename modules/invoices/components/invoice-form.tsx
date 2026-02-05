'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming it exists or I replace with simple textarea
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createInvoiceSchema, CreateInvoiceFormValues } from '../types';
import { invoiceService } from '../services';
import { quotationService } from '@/modules/quotations/services';
import { Customer, Product } from '@/modules/quotations/types';

export function InvoiceForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const quotationId = searchParams.get('quotationId');

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<CreateInvoiceFormValues>({
        resolver: zodResolver(createInvoiceSchema) as any,
        defaultValues: {
            issue_date: new Date().toISOString().split('T')[0],
            status: 'draft',
            tax_rate: 18,
            items: [{ description: '', quantity: 1, unit_price: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    const watchItems = form.watch('items');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [customersData, productsData] = await Promise.all([
                quotationService.getCustomers(),
                quotationService.getProducts()
            ]);
            setCustomers(customersData as Customer[]);
            setProducts(productsData as Product[]);

            // Check for quotation ID to pre-fill
            if (quotationId) {
                const prefillData = await invoiceService.generateFromQuotation(quotationId);
                form.reset(prefillData);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoadingData(false);
        }
    };

    // Auto-fill price and description when product changes
    useEffect(() => {
        watchItems.forEach((item, index) => {
            if (item.product_id && products.length > 0) {
                const product = products.find((p) => p.id === item.product_id);
                // If the description is empty or matches previous product check, update it?
                // For simplicity, if product is selected and price is 0, fill it.
                if (product) {
                    const currentValues = form.getValues(`items.${index}`);

                    // Only auto-fill if the item seems "fresh" or user is switching product
                    // We can compare against current state logic, but let's just do it if description is empty or mismatched
                    if (!item.description || item.unit_price === 0) {
                        form.setValue(`items.${index}.description`, product.name);
                        form.setValue(`items.${index}.unit_price`, product.price);
                    }
                }
            }
        });
    }, [JSON.stringify(watchItems.map(i => i.product_id)), products, form]);

    const subtotal = watchItems.reduce((acc, item) => {
        return acc + (item.quantity * item.unit_price || 0);
    }, 0);

    const taxRate = form.watch('tax_rate') || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount;

    const onSubmit = async (data: CreateInvoiceFormValues) => {
        setSubmitting(true);
        try {
            const invoice = await invoiceService.createInvoice(data);
            router.push(`/invoices/${invoice.id}`);
        } catch (error) {
            console.error("Failed to create invoice", error);
            alert("Failed to create invoice");
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingData) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/invoices">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">New Invoice</h1>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Customer</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                    {...form.register('customer_id')}
                                >
                                    <option value="">Select a customer...</option>
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {form.formState.errors.customer_id && (
                                    <p className="text-sm text-red-500">{form.formState.errors.customer_id.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Issue Date</label>
                                <Input type="date" {...form.register('issue_date')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Due Date</label>
                                <Input type="date" {...form.register('due_date')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                    {...form.register('status')}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="sent">Sent</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">GST Rate (%)</label>
                                <Input type="number" {...form.register('tax_rate')} />
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea {...form.register('notes')} placeholder="Payment terms, notes (optional)" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Items</CardTitle>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => append({ description: '', quantity: 1, unit_price: 0 })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-col gap-2 p-4 border rounded-lg bg-slate-50/50">
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-medium">Product (Optional)</label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                            {...form.register(`items.${index}.product_id`)}
                                        >
                                            <option value="">Select Product (or type description below)...</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-[2] space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <Input {...form.register(`items.${index}.description`)} placeholder="Item description" />
                                    </div>
                                </div>

                                <div className="flex gap-4 items-end">
                                    <div className="w-24 space-y-2">
                                        <label className="text-sm font-medium">Qty</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            {...form.register(`items.${index}.quantity`)}
                                        />
                                    </div>

                                    <div className="w-32 space-y-2">
                                        <label className="text-sm font-medium">Price</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            {...form.register(`items.${index}.unit_price`)}
                                        />
                                    </div>

                                    <div className="w-32 space-y-2">
                                        <label className="text-sm font-medium">Total</label>
                                        <div className="flex h-10 w-full items-center rounded-md border border-slate-100 bg-slate-50 px-3 text-sm text-slate-500">
                                            {((watchItems[index]?.quantity || 0) * (watchItems[index]?.unit_price || 0)).toFixed(2)}
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {form.formState.errors.items && (
                            <p className="text-sm text-red-500">{form.formState.errors.items.message}</p>
                        )}

                        <div className="flex flex-col items-end pt-4 space-y-2">
                            <div className="text-sm text-slate-500">
                                Subtotal: ${subtotal.toFixed(2)}
                            </div>
                            <div className="text-sm text-slate-500">
                                tax ({taxRate}%): ${taxAmount.toFixed(2)}
                            </div>
                            <div className="text-2xl font-bold">
                                Grand Total: ${grandTotal.toFixed(2)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Create Invoice'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
