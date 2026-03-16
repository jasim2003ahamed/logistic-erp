'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { InvoiceForm } from '@/modules/invoices/components/invoice-form';

export default function EditInvoicePage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <div className="container mx-auto py-10">
            <Suspense fallback={<div>Loading form...</div>}>
                <InvoiceForm id={id} />
            </Suspense>
        </div>
    );
}
