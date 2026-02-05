import { DeliveryOrderDetail } from '@/modules/delivery-orders/components/delivery-order-detail';

export default async function DeliveryOrderDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <div className="container mx-auto py-10">
            <DeliveryOrderDetail id={id} />
        </div>
    );
}
