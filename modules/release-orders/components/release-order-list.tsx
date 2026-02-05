'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReleaseOrders } from '../hooks/useReleaseOrders';
import { PackageCheck } from 'lucide-react';

export function ReleaseOrderList() {
    const { data: releaseOrders, isLoading, error } = useReleaseOrders();

    if (isLoading) return <div className="p-10 text-center">Loading release orders...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error loading release orders.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Release Orders</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PackageCheck className="h-5 w-5" />
                        Recent Orders
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-slate-100/50">
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">RO #</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Invoice #</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Customer</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {releaseOrders?.map((ro) => (
                                    <tr key={ro.id} className="border-b transition-colors hover:bg-slate-100/50">
                                        <td className="p-4 align-middle font-medium">#{ro.release_number}</td>
                                        <td className="p-4 align-middle font-medium">
                                            {ro.invoice ? `#${ro.invoice.invoice_number}` : '-'}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {(ro.invoice as any)?.customer?.name || 'Unknown'}
                                        </td>
                                        <td className="p-4 align-middle capitalize">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ro.status === 'released' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                {ro.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {new Date(ro.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/release-order/${ro.id}`}>View</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {releaseOrders?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center text-slate-500">
                                            No release orders found.
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
