'use client';

import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
import { LocationSelect } from './location-select';
import { AIRPORTS } from '../lib/airports';
import { SEA_PORTS } from '../lib/ports';

interface InvoiceFormProps {
    id?: string;
}

export function InvoiceForm({ id }: InvoiceFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const quotationId = searchParams.get('quotationId');

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [nextInvoiceNumber, setNextInvoiceNumber] = useState<string>('');
    const [nextJobNumber, setNextJobNumber] = useState<string>('');

    const form = useForm<CreateInvoiceFormValues>({
        resolver: zodResolver(createInvoiceSchema) as any,
        defaultValues: {
            issue_date: new Date().toISOString().split('T')[0],
            status: 'draft',
            currency: 'SGD',
            items: [{ description: '', quantity: 1, unit_price: 0, currency: 'SGD' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    const watchItems = form.watch('items');
    const serviceModesValue = form.watch('service_modes');
    const serviceModes = Array.isArray(serviceModesValue) ? serviceModesValue : [];
    const isShipSpares = serviceModes.some(m => m.toLowerCase().includes('ship spares'));
    const isAir = serviceModes.some(m => m.toLowerCase().includes('air freight'));
    const isSea = serviceModes.some(m => m.toLowerCase().includes('sea freight'));
    
    // Choose which location list to show based on selected service modes
    // Prioritize Airports if Air Freight is selected, otherwise default to Sea Ports
    const locations = isAir ? AIRPORTS : SEA_PORTS;

    const watchTerms = form.watch('terms');
    const watchIssueDate = form.watch('issue_date');

    // Auto-calculate Due Date based on Terms
    useEffect(() => {
        if (!watchTerms || !watchIssueDate) return;

        const daysMatch = watchTerms.match(/(\d+)\s+Days/);
        if (daysMatch) {
            const days = parseInt(daysMatch[1]);
            const date = new Date(watchIssueDate);
            if (!isNaN(date.getTime())) {
                date.setDate(date.getDate() + days);
                form.setValue('due_date', date.toISOString().split('T')[0]);
            }
        } else if (watchTerms.includes('COD') || watchTerms.includes('CIA') || watchTerms.includes('PPD')) {
            // Standard terms usually mean due on issue date or immediate
            form.setValue('due_date', watchIssueDate);
        }
    }, [watchTerms, watchIssueDate, form]);

    useEffect(() => {
        loadData();
    }, [id]); // Reload if ID changes

    const loadData = async () => {
        try {
            const [customersData, productsData] = await Promise.all([
                quotationService.getCustomers(),
                quotationService.getProducts()
            ]);
            setCustomers(customersData as Customer[]);
            setProducts(productsData as Product[]);

            if (id) {
                const existingInvoice = await invoiceService.getInvoiceById(id);
                if (existingInvoice) {
                    form.reset({
                        customer_id: existingInvoice.customer_id,
                        invoice_number: existingInvoice.invoice_number,
                        job_number: existingInvoice.job_number || undefined,
                        quotation_id: existingInvoice.quotation_id || undefined,
                        parent_invoice_id: existingInvoice.parent_invoice_id || undefined,
                        issue_date: existingInvoice.issue_date,
                        due_date: existingInvoice.due_date || undefined,
                        status: existingInvoice.status,
                        terms: existingInvoice.terms || undefined,
                        currency: existingInvoice.currency,
                        service_modes: existingInvoice.service_modes || [],
                        shipment_type: existingInvoice.shipment_type || undefined,
                        hbl_hawb: existingInvoice.hbl_hawb || undefined,
                        mbl_mawb: existingInvoice.mbl_mawb || undefined,
                        vessel_flight: existingInvoice.vessel_flight || undefined,
                        voyage_no: existingInvoice.voyage_no || undefined,
                        pol: existingInvoice.pol || undefined,
                        pod: existingInvoice.pod || undefined,
                        vessel_pod: existingInvoice.vessel_pod || undefined,
                        delivery_address: existingInvoice.delivery_address || undefined,
                        etd: existingInvoice.etd || undefined,
                        eta: existingInvoice.eta || undefined,
                        commodity: existingInvoice.commodity || undefined,
                        hs_code: existingInvoice.hs_code || undefined,
                        num_packages: existingInvoice.num_packages || undefined,
                        gross_weight: existingInvoice.gross_weight || undefined,
                        volume: existingInvoice.volume || undefined,
                        container_type: existingInvoice.container_type || undefined,
                        temperature: existingInvoice.temperature || undefined,
                        imo_no: existingInvoice.imo_no || undefined,
                        berth_anchorage: existingInvoice.berth_anchorage || undefined,
                        vessel_delivery_date: existingInvoice.vessel_delivery_date || undefined,
                        notes: existingInvoice.notes || undefined,
                        items: existingInvoice.items?.map(item => ({
                            product_id: item.product_id || undefined,
                            description: item.description,
                            quantity: item.quantity,
                            unit_price: item.unit_price,
                            currency: item.currency || 'SGD'
                        })) || []
                    });
                }
            } else if (quotationId) {
                const prefillData = await invoiceService.generateFromQuotation(quotationId);
                form.reset({
                    ...form.getValues(),
                    ...prefillData,
                    currency: 'SGD',
                    service_modes: [],
                });
            }

            if (!id) {
                try {
                    const [nextInvNum, nextJobNum] = await Promise.all([
                        invoiceService.generateNextInvoiceNumber(),
                        invoiceService.generateNextJobNumber(),
                    ]);
                    setNextInvoiceNumber(nextInvNum);
                    setNextJobNumber(nextJobNum);
                    form.setValue('invoice_number', nextInvNum);
                    form.setValue('job_number', nextJobNum);
                } catch (numError) {
                    console.error("Non-critical: Failed to generate next invoice/job number.", numError);
                    const fallbackInv = 'DUS-2026-X-DDNN';
                    const fallbackJob = 'DUS-JB-DDMMYYYYNN';
                    setNextInvoiceNumber(fallbackInv);
                    setNextJobNumber(fallbackJob);
                    form.setValue('invoice_number', fallbackInv);
                    form.setValue('job_number', fallbackJob);
                }
            }
        } catch (error) {
            console.error("Critical error in loadData:", error);
            // Optionally set a flag to show a more descriptive error in UI
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

    const grandTotal = subtotal;

    const onSubmit = async (data: CreateInvoiceFormValues) => {
        setSubmitting(true);
        try {
            const invoice = id
                ? await invoiceService.updateInvoice(id, data)
                : await invoiceService.createInvoice(data);
            router.push(`/invoices/${invoice.id}`);
        } catch (error: any) {
            console.error(`Failed to ${id ? 'update' : 'create'} invoice`, error);
            alert(`Failed to ${id ? 'update' : 'create'} invoice: ${error.message || 'Unknown error'}`);
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
                <h1 className="text-3xl font-bold">{id ? 'Edit Invoice' : 'New Invoice'}</h1>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Header & Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Customer</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                    {...form.register('customer_id')}
                                >
                                    <option value="">Select a customer...</option>
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.company_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Invoice Number</label>
                                <Input
                                    {...form.register('invoice_number')}
                                    placeholder="DUS-2026-X-DDNN"
                                    readOnly
                                    className="bg-slate-50 font-bold"
                                />
                                {!id && <p className="text-[10px] text-slate-500 italic">Auto-generated upon save</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Job Number</label>
                                <Input
                                    {...form.register('job_number')}
                                    placeholder="DUS-JB-DDMMYYYYNN"
                                    className="bg-white font-bold"
                                />
                                {!id && <p className="text-[10px] text-slate-500 italic">Auto-generated upon save</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Parent Invoice (Optional)</label>
                                <Input placeholder="Related Invoice ID" {...form.register('parent_invoice_id')} />
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
                                <label className="text-sm font-medium">Payment Terms</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 font-bold text-blue-600"
                                    {...form.register('terms')}
                                >
                                    <option value="">Select Terms...</option>
                                    <optgroup label="Standard Terms">
                                        <option value="COD (Cash On Delivery)">COD (Cash On Delivery)</option>
                                        <option value="CIA (Cash In Advance)">CIA (Cash In Advance)</option>
                                        <option value="PPD (Prepaid)">PPD (Prepaid)</option>
                                    </optgroup>
                                    <optgroup label="Credit Terms">
                                        <option value="Payment Due in 7 Days">Payment Due in 7 Days</option>
                                        <option value="Payment Due in 14 Days">Payment Due in 14 Days</option>
                                        <option value="Payment Due in 30 Days">Payment Due in 30 Days</option>
                                        <option value="Payment Due in 45 Days">Payment Due in 45 Days</option>
                                        <option value="Payment Due in 60 Days">Payment Due in 60 Days</option>
                                        <option value="Payment Due in 90 Days">Payment Due in 90 Days</option>
                                    </optgroup>
                                </select>
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
                                <label className="text-sm font-medium">Currency</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                    {...form.register('currency')}
                                >
                                    <option value="SGD">SGD</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Mode of Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                'Air Freight',
                                'Sea Freight (FCL / LCL / Reefer / Breakbulk)',
                                'Road Freight (Local / Cross-Border)',
                                'Cross Trade Shipment',
                                'Customs Clearance',
                                'Warehouse & Distribution',
                                'Ship Spares in Transit',
                                'Provisions & Vessel Supplies',
                                'Cargo Insurance'
                            ].map((mode) => (
                                <label key={mode} className="flex items-center space-x-2 text-sm">
                                    <input
                                        type="checkbox"
                                        value={mode}
                                        {...form.register('service_modes')}
                                        className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                                    />
                                    <span>{mode}</span>
                                </label>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Shipment & Vessel Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-sm font-medium">Shipment Type</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                    {...form.register('shipment_type')}
                                >
                                    <option value="">Select type...</option>
                                    <option value="Import">Import</option>
                                    <option value="Export">Export</option>
                                    <option value="Transshipment">Transshipment</option>
                                    <option value="Cross Trade">Cross Trade</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">MBL / MAWB No</label>
                                <Input {...form.register('mbl_mawb')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">HBL / HAWB No</label>
                                <Input {...form.register('hbl_hawb')} />
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-sm font-medium">Vessel / Flight Name</label>
                                <Input {...form.register('vessel_flight')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Voyage No</label>
                                <Input {...form.register('voyage_no')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">HS Code</label>
                                <Input {...form.register('hs_code')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{isAir ? 'Airport of Loading' : 'Port of Loading (POL)'}</label>
                                <Controller
                                    name="pol"
                                    control={form.control}
                                    render={({ field }) => (
                                        <LocationSelect 
                                            value={field.value} 
                                            onChange={field.onChange} 
                                            placeholder={isAir ? 'Select loading airport...' : 'Select port of loading...'}
                                            locations={locations}
                                        />
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{isAir ? 'Airport of Discharge' : 'Port of Discharge (POD)'}</label>
                                <Controller
                                    name="pod"
                                    control={form.control}
                                    render={({ field }) => (
                                        <LocationSelect 
                                            value={field.value} 
                                            onChange={field.onChange} 
                                            placeholder={isAir ? 'Select discharge airport...' : 'Select port of discharge...'}
                                            locations={locations}
                                        />
                                    )}
                                />
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-sm font-medium">Final Delivery Address</label>
                                <Input {...form.register('delivery_address')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ETD</label>
                                <Input type="date" {...form.register('etd')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ETA</label>
                                <Input type="date" {...form.register('eta')} />
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-sm font-medium">Commodity</label>
                                <Input {...form.register('commodity')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">No. of Packages</label>
                                <Input {...form.register('num_packages')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Gross Weight (KGS)</label>
                                <Input {...form.register('gross_weight')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Volume (CBM)</label>
                                <Input {...form.register('volume')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Container Type</label>
                                <Input placeholder="20FT / 40HC etc." {...form.register('container_type')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Temperature (°C)</label>
                                <Input {...form.register('temperature')} />
                            </div>
                        </div>

                        {/* Vessel Supply Details */}
                        <div className="mt-8 pt-8 border-t">
                            <h3 className="text-lg font-bold mb-4">Vessel Supply / Ship Spares Details (If Applicable)</h3>
                            <div className={`grid gap-4 sm:grid-cols-2 ${isShipSpares ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{isShipSpares ? 'Vessel Name' : 'IMO No'}</label>
                                    <Input {...form.register('imo_no')} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{isShipSpares ? 'Port of Loading' : 'Berth / Anchorage'}</label>
                                    <Input {...form.register('berth_anchorage')} />
                                </div>
                                {isShipSpares && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Port of Discharge</label>
                                        <Input {...form.register('vessel_pod')} placeholder="Type discharge port..." />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Delivery Date</label>
                                    <Input type="date" {...form.register('vessel_delivery_date')} />
                                </div>
                            </div>
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
                            onClick={() => append({ description: '', quantity: 1, unit_price: 0, currency: 'SGD' })}
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

                                    <div className="w-24 space-y-2">
                                        <label className="text-sm font-medium">Currency</label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                            {...form.register(`items.${index}.currency`)}
                                        >
                                            <option value="SGD">SGD</option>
                                            <option value="USD">USD</option>
                                        </select>
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

                        <div className="text-2xl font-bold">
                            Total: ${grandTotal.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notes / Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="All payments subject to agreed terms and conditions."
                            {...form.register('notes')}
                            className="min-h-[100px]"
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={submitting}>
                        {submitting ? 'Saving...' : id ? 'Update Invoice' : 'Create Invoice'}
                    </Button>
                </div>
            </form>
        </div >
    );
}
