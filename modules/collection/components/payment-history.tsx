'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { usePaymentHistory } from '../hooks/useCollections';
import { History } from 'lucide-react';

export function PaymentHistory() {
    const { data: payments, isLoading, error } = usePaymentHistory();

    if (isLoading) return <div className="p-10 text-center text-slate-500 font-medium font-medium">Loading history...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error loading history.</div>;

    const getModeColor = (mode: string) => {
        switch (mode) {
            case 'cash': return 'bg-emerald-100 text-emerald-800';
            case 'upi': return 'bg-indigo-100 text-indigo-800';
            case 'bank_transfer': return 'bg-blue-100 text-blue-800';
            default: return 'bg-slate-100';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-slate-500" />
                    Recent Payments
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b text-slate-500">
                                <th className="h-10 px-4 font-medium">Date</th>
                                <th className="h-10 px-4 font-medium">Invoice #</th>
                                <th className="h-10 px-4 font-medium">Customer</th>
                                <th className="h-10 px-4 font-medium">Mode</th>
                                <th className="h-10 px-4 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {payments?.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50 transition-colors border-b">
                                    <td className="p-4 text-slate-600">
                                        {new Date(payment.payment_date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-medium">#{payment.invoice?.invoice_number}</td>
                                    <td className="p-4 text-slate-600">
                                        {(payment.invoice as any)?.customer?.name || 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="secondary" className={getModeColor(payment.payment_mode)}>
                                            {payment.payment_mode.replace('_', ' ')}
                                        </Badge>
                                        {payment.reference_number && (
                                            <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">
                                                Ref: {payment.reference_number}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-right font-bold text-emerald-600">
                                        + ₹ {Number(payment.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            {payments?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                                        No payment records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
