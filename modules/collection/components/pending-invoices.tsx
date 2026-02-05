'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { usePendingInvoices } from '../hooks/useCollections';
import { PendingInvoice } from '../types';
import { PaymentModal } from './payment-modal';
import { ReceiptCent } from 'lucide-react';

export function PendingInvoices() {
    const { data: invoices, isLoading, error } = usePendingInvoices();
    const [selectedInvoice, setSelectedInvoice] = useState<PendingInvoice | null>(null);

    if (isLoading) return <div className="p-10 text-center text-slate-500 font-medium">Loading pending invoices...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error loading invoices.</div>;

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ReceiptCent className="h-5 w-5 text-amber-600" />
                        Pending Collections
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b text-slate-500">
                                    <th className="h-10 px-4 font-medium">Invoice #</th>
                                    <th className="h-10 px-4 font-medium">Customer</th>
                                    <th className="h-10 px-4 font-medium text-right">Total</th>
                                    <th className="h-10 px-4 font-medium text-right">Balance</th>
                                    <th className="h-10 px-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {invoices?.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium">#{inv.invoice_number}</td>
                                        <td className="p-4">{(inv.customer as any)?.name || 'N/A'}</td>
                                        <td className="p-4 text-right">₹ {Number(inv.total_amount).toFixed(2)}</td>
                                        <td className="p-4 text-right">
                                            <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200">
                                                ₹ {inv.balance_amount.toFixed(2)}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button size="sm" onClick={() => setSelectedInvoice(inv)}>
                                                Collect
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {invoices?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                                            No pending collections.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {selectedInvoice && (
                <PaymentModal
                    invoice={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </div>
    );
}
