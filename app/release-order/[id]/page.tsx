import { ReleaseOrderDetail } from '@/modules/release-orders/components/release-order-detail';

export default async function ReleaseOrderDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <div className="container mx-auto py-10">
            <ReleaseOrderDetail id={id} />
        </div>
    );
}
