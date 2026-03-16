import { QuotationDetail } from "@/modules/quotations/components/quotation-detail";

export default async function QuotationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <div className="container mx-auto py-10">
            <QuotationDetail id={id} />
        </div>
    );
}
