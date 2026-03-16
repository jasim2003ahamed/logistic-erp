'use client';

import Link from 'next/link';
import { Pencil, Plus, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuotations, useDeleteQuotation } from '../hooks/useQuotations';
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
import { Quotation } from '../types';

export function QuotationList() {
    const { data: quotations, isLoading, error } = useQuotations();
    const { mutate: deleteQuotation, isPending: isDeleting } = useDeleteQuotation();
    const [deletingQuotation, setDeletingQuotation] = useState<Quotation | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = () => {
        if (deletingQuotation) {
            deleteQuotation(deletingQuotation.id, {
                onSuccess: () => {
                    toast.success('Quotation deleted successfully');
                    setDeletingQuotation(null);
                },
                onError: (err: any) => {
                    toast.error(`Error: ${err.message || 'Failed to delete quotation'}`);
                }
            });
        }
    };

    const filteredQuotations = quotations?.filter(quotation =>
        String(quotation.quotation_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quotation.customer?.company_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (quotation.status?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <div>Loading quotations...</div>;
    if (error) return <div className="text-red-500">Error loading quotations</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Quotations</h1>
                <Button asChild>
                    <Link href="/quotations/new">
                        <Plus className="mr-2 h-4 w-4" /> New Quotation
                    </Link>
                </Button>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingQuotation} onOpenChange={(open: boolean) => !open && setDeletingQuotation(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete quotation
                            {deletingQuotation && <span className="font-semibold"> #{deletingQuotation.quotation_number}</span>}.
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
                    <CardTitle>Recent Quotations</CardTitle>
                    <div className="relative w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search quotations..."
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
                                <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100">
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">ID</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Customer</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Amount</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredQuotations?.map((quotation) => (
                                    <tr
                                        key={quotation.id}
                                        className="border-b transition-colors hover:bg-slate-100/50"
                                    >
                                        <td className="p-4 align-middle font-medium">#{quotation.quotation_number}</td>
                                        <td className="p-4 align-middle">{quotation.customer?.company_name || 'Unknown'}</td>
                                        <td className="p-4 align-middle">{new Date(quotation.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle capitalize">{quotation.status}</td>
                                        <td className="p-4 align-middle text-right">${quotation.total_amount?.toLocaleString()}</td>
                                        <td className="p-4 align-middle text-right space-x-2">
                                            <Button variant="ghost" size="sm" asChild title="View Details">
                                                <Link href={`/quotations/${quotation.id}`}>View</Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" asChild title="Edit Quotation" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                <Link href={`/quotations/edit/${quotation.id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeletingQuotation(quotation)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                title="Delete Quotation"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredQuotations?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-slate-500">
                                            No quotations found.
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
