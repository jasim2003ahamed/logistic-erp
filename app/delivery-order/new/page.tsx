'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deliveryOrderService } from '@/modules/delivery-orders/services';
import { CreateDeliveryOrderFormValues } from '@/modules/delivery-orders/types';
import { DeliveryOrderForm } from '@/modules/delivery-orders/components/delivery-order-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewDeliveryOrderPage() {
    const searchParams = useSearchParams();
    const roId = searchParams.get('roId');
    const [initialValues, setInitialValues] = useState<Partial<CreateDeliveryOrderFormValues> | null>(null);

    useEffect(() => {
        if (roId) {
            deliveryOrderService.generateFromReleaseOrder(roId).then(setInitialValues);
        }
    }, [roId]);

    if (!roId) return <div className="p-10 text-center">Release Order ID required.</div>;
    if (!initialValues) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/release-order/${roId}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">New Delivery Order</h1>
            </div>
            <DeliveryOrderForm initialValues={initialValues} />
        </div>
    );
}
