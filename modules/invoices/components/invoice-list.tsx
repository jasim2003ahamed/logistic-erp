'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // We verified these exist
import { useEffect, useState } from 'react';
import { Invoice } from '../types';
import { invoiceService } from '../services';

export function InvoiceList() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const data = await invoiceService.getInvoices();
            setInvoices(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load invoices');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading invoices...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Invoices</h1>
                <Button asChild>
                    <Link href="/invoices/new">
                        <Plus className="mr-2 h-4 w-4" /> New Invoice
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-slate-100/50">
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">ID</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Customer</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Amount</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {invoices.map((invoice) => (
                                    <tr
                                        key={invoice.id}
                                        className="border-b transition-colors hover:bg-slate-100/50"
                                    >
                                        <td className="p-4 align-middle font-medium">#{invoice.invoice_number}</td>
                                        <td className="p-4 align-middle">{invoice.customer?.name || 'Unknown'}</td>
                                        <td className="p-4 align-middle">{new Date(invoice.issue_date).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle capitalize">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                    invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                                        'bg-slate-100 text-slate-900'
                                                }`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">${invoice.total_amount?.toLocaleString()}</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/invoices/${invoice.id}`}>View</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {invoices.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-slate-500">
                                            No invoices found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
