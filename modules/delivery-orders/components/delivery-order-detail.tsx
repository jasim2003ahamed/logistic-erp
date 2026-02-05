'use client';

import { ArrowLeft, CheckCircle, Truck, Package, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeliveryOrder, useUpdateDeliveryOrderStatus } from '../hooks/useDeliveryOrders';

interface DeliveryOrderDetailProps {
    id: string;
}

export function DeliveryOrderDetail({ id }: DeliveryOrderDetailProps) {
    const { data: delivery, isLoading, error } = useDeliveryOrder(id);
    const updateStatus = useUpdateDeliveryOrderStatus();

    if (isLoading) return <div className="p-10 text-center">Loading delivery order...</div>;
    if (error || !delivery) return <div className="p-10 text-center text-red-500">Error loading delivery order.</div>;

    const handleMarkDelivered = async () => {
        try {
            await updateStatus.mutateAsync({ id, status: 'delivered' });
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
                        <Link href="/delivery-order">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">Delivery Order #{delivery.delivery_number}</h1>
                </div>
                {delivery.status === 'dispatched' && (
                    <Button onClick={handleMarkDelivered} disabled={updateStatus.isPending} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {updateStatus.isPending ? 'Updating...' : 'Mark as Delivered'}
                    </Button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-500">Shipment Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Status:</span>
                            <span className="font-bold capitalize text-blue-600">{delivery.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Date:</span>
                            <span className="font-medium">{new Date(delivery.delivery_date).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-500">Logistics Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Driver:</span>
                            <span className="font-medium">{delivery.driver_name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Vehicle:</span>
                            <span className="font-medium">{delivery.vehicle_number}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-500">Related Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {delivery.release_order && (
                            <div className="flex justify-between text-sm">
                                <span>Release Order:</span>
                                <Link href={`/release-order/${delivery.release_order_id}`} className="text-blue-600 hover:underline">
                                    #{delivery.release_order.release_number}
                                </Link>
                            </div>
                        )}
                        {(delivery.release_order as any)?.invoice && (
                            <div className="flex justify-between text-sm">
                                <span>Invoice:</span>
                                <Link href={`/invoices/${(delivery.release_order as any).invoice_id}`} className="text-blue-600 hover:underline">
                                    #{(delivery.release_order as any).invoice.invoice_number}
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Consignment Items
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
                                {(delivery.release_order as any)?.items?.map((item: any) => (
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
