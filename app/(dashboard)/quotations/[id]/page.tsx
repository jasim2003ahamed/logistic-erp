import { QuotationDetail } from "@/modules/quotations/components/quotation-detail";

export default function QuotationDetailPage({
    params,
}: {
    params: { id: string };
}) {
    return (
        <div className="container mx-auto py-10">
            <QuotationDetail id={params.id} />
        </div>
    );
}
