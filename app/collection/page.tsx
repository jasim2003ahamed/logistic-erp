'use client';

import { PendingInvoices } from '@/modules/collection/components/pending-invoices';
import { PaymentHistory } from '@/modules/collection/components/payment-history';
import { CreditCard } from 'lucide-react';

export default function CollectionPage() {
    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg ring-4 ring-slate-100">
                    <CreditCard className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                    <p className="text-slate-500">Track pending invoices and record customer payments.</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        Outstanding Invoices
                    </h2>
                    <PendingInvoices />
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        Payment Records
                    </h2>
                    <PaymentHistory />
                </div>
            </div>
        </div>
    );
}
