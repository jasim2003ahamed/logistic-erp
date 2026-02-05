'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuotations } from '../hooks/useQuotations';

export function QuotationList() {
    const { data: quotations, isLoading, error } = useQuotations();

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

            <Card>
                <CardHeader>
                    <CardTitle>Recent Quotations</CardTitle>
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
                                {quotations?.map((quotation) => (
                                    <tr
                                        key={quotation.id}
                                        className="border-b transition-colors hover:bg-slate-100/50"
                                    >
                                        <td className="p-4 align-middle font-medium">#{quotation.quotation_number}</td>
                                        <td className="p-4 align-middle">{quotation.customer?.name || 'Unknown'}</td>
                                        <td className="p-4 align-middle">{new Date(quotation.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle capitalize">{quotation.status}</td>
                                        <td className="p-4 align-middle text-right">${quotation.total_amount?.toLocaleString()}</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/quotations/${quotation.id}`}>View</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {quotations?.length === 0 && (
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
