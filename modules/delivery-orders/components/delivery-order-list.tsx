'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeliveryOrders } from '../hooks/useDeliveryOrders';
import { Truck } from 'lucide-react';

export function DeliveryOrderList() {
    const { data: dos, isLoading, error } = useDeliveryOrders();

    if (isLoading) return <div className="p-10 text-center">Loading delivery orders...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error loading delivery orders.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Delivery Orders</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Active Shipments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-slate-100/50">
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">DO #</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">RO #</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Driver / Vehicle</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {dos?.map((doItem) => (
                                    <tr key={doItem.id} className="border-b transition-colors hover:bg-slate-100/50">
                                        <td className="p-4 align-middle font-medium">#{doItem.delivery_number}</td>
                                        <td className="p-4 align-middle">
                                            {doItem.release_order ? `#${doItem.release_order.release_number}` : '-'}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="font-medium">{doItem.driver_name}</div>
                                            <div className="text-xs text-slate-500">{doItem.vehicle_number}</div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {new Date(doItem.delivery_date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle capitalize">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${doItem.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {doItem.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/delivery-order/${doItem.id}`}>View</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {dos?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center text-slate-500">
                                            No delivery orders found.
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
