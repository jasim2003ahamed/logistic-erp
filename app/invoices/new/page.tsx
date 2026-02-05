import { InvoiceForm } from '@/modules/invoices/components/invoice-form';
import { Suspense } from 'react';

export default function NewInvoicePage() {
    return (
        <div className="container mx-auto py-10">
            <Suspense fallback={<div>Loading form...</div>}>
                <InvoiceForm />
            </Suspense>
        </div>
    );
}
