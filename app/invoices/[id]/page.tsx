'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { InvoiceTemplate } from '@/modules/invoices/components/invoice-template';
import { InvoiceActions } from '@/modules/invoices/components/invoice-actions';
import { invoiceService } from '@/modules/invoices/services';
import { Invoice } from '@/modules/invoices/types';

export default function InvoiceDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) {
            invoiceService.getInvoiceById(id)
                .then(setInvoice)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="p-10">Loading invoice...</div>;
    if (!invoice) return <div className="p-10">Invoice not found</div>;

    return (
        <div className="container mx-auto py-10 print:p-0">
            {/* Toolbar - Hidden in Print */}
            <div className="mb-6 flex justify-between items-center print:hidden">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/invoices">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
                    </Link>
                </Button>
                <InvoiceActions
                    invoiceId={invoice.id}
                    invoiceNumber={invoice.invoice_number as string}
                    printRef={printRef}
                    status={invoice.status}
                />
            </div>

            {/* Printable Content */}
            <div ref={printRef}>
                <InvoiceTemplate invoice={invoice} />
            </div>
        </div>
    );
}
