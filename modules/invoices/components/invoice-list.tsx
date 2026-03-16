'use client';

import Link from 'next/link';
import { Pencil, Plus, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Invoice } from '../types';
import { invoiceService } from '../services';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

export function InvoiceList() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const data = await invoiceService.getInvoices();
            setInvoices(data);
        } catch (err: any) {
            console.error(err);
            setError('Failed to load invoices');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingInvoice) return;

        setIsDeleting(true);
        try {
            await invoiceService.deleteInvoice(deletingInvoice.id);
            toast.success('Invoice deleted successfully');
            setDeletingInvoice(null);
            loadInvoices(); // Refresh list
        } catch (err: any) {
            toast.error(`Error: ${err.message || 'Failed to delete invoice'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredInvoices = invoices.filter(invoice =>
        (invoice.invoice_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (invoice.customer?.company_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (invoice.status?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

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

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingInvoice} onOpenChange={(open: boolean) => !open && setDeletingInvoice(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete invoice
                            {deletingInvoice && <span className="font-semibold"> #{deletingInvoice.invoice_number}</span>}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Recent Invoices</CardTitle>
                    <div className="relative w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search invoices..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-slate-100/50">
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Invoice ID</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Customer</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Amount</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredInvoices.map((invoice) => (
                                    <tr
                                        key={invoice.id}
                                        className="border-b transition-colors hover:bg-slate-100/50"
                                    >
                                        <td className="p-4 align-middle font-medium">{invoice.invoice_number}</td>
                                        <td className="p-4 align-middle">{invoice.customer?.company_name || 'Unknown'}</td>
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
                                        <td className="p-4 align-middle text-right space-x-2">
                                            <Button variant="ghost" size="sm" asChild title="View Details">
                                                <Link href={`/invoices/${invoice.id}`}>View</Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" asChild title="Edit Invoice" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                <Link href={`/invoices/${invoice.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeletingInvoice(invoice)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                title="Delete Invoice"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredInvoices.length === 0 && (
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
