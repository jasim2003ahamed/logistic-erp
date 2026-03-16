'use client';

import { PendingInvoices } from '@/modules/collection/components/pending-invoices';
import { CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CollectionNoteModal } from '@/modules/collection/components/collection-note-modal';

export default function CollectionPage() {
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg ring-4 ring-slate-100">
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                        <p className="text-slate-500">Track pending invoices and record customer payments.</p>
                    </div>
                </div>
                <Button onClick={() => setIsManualModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Collection Note
                </Button>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    Outstanding Invoices
                </h2>
                <PendingInvoices />
            </div>

            <CollectionNoteModal
                isOpen={isManualModalOpen}
                data={null}
                type="manual"
                onClose={() => setIsManualModalOpen(false)}
            />
        </div>
    );
}
