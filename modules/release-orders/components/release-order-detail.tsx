'use client';

import { ArrowLeft, CheckCircle, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReleaseOrder, useUpdateReleaseOrderStatus } from '../hooks/useReleaseOrders';

interface ReleaseOrderDetailProps {
    id: string;
}

export function ReleaseOrderDetail({ id }: ReleaseOrderDetailProps) {
    const { data: ro, isLoading, error } = useReleaseOrder(id);
    const updateStatus = useUpdateReleaseOrderStatus();

    if (isLoading) return <div className="p-10 text-center">Loading release order...</div>;
    if (error || !ro) return <div className="p-10 text-center text-red-500">Error loading release order.</div>;

    const handleRelease = async () => {
        try {
            await updateStatus.mutateAsync({ id, status: 'released' });
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/release-order">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">Release Order #{ro.release_number}</h1>
                </div>
                <div className="flex items-center gap-2">
                    {ro.status === 'pending' && (
                        <Button onClick={handleRelease} disabled={updateStatus.isPending}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {updateStatus.isPending ? 'Updating...' : 'Mark as Released'}
                        </Button>
                    )}
                    {ro.status === 'released' && (
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href={`/delivery-order/new?roId=${ro.id}`}>
                                <Truck className="mr-2 h-4 w-4" />
                                Create Delivery Order
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 text-sm">
                            <span className="text-slate-500">Status:</span>
                            <span className="font-medium capitalize">{ro.status}</span>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                            <span className="text-slate-500">Date:</span>
                            <span className="font-medium">{new Date(ro.created_at).toLocaleString()}</span>
                        </div>
                        {ro.invoice_id && (
                            <div className="grid grid-cols-2 text-sm">
                                <span className="text-slate-500">Invoice:</span>
                                <Link href={`/invoices/${ro.invoice_id}`} className="text-blue-600 hover:underline">
                                    #{ro.invoice?.invoice_number}
                                </Link>
                            </div>
                        )}
                        <div className="grid grid-cols-2 text-sm">
                            <span className="text-slate-500">Customer:</span>
                            <span className="font-medium">{(ro.invoice as any)?.customer?.company_name || 'N/A'}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{ro.notes || 'No notes.'}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Items to Release
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="border-b">
                                <tr className="text-slate-500">
                                    <th className="py-2 px-4 font-medium">Description</th>
                                    <th className="py-2 px-4 font-medium text-right">Quantity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {ro.items?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-3 px-4">{item.description}</td>
                                        <td className="py-3 px-4 text-right font-medium">{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
