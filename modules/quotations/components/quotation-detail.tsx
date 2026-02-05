'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuotation } from '../hooks/useQuotations';

export function QuotationDetail({ id }: { id: string }) {
    const { data: quotation, isLoading, error } = useQuotation(id);
    const router = useRouter();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error loading quotation</div>;
    if (!quotation) return <div>Quotation not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/quotations/list">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">Quotation #{quotation.quotation_number}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${quotation.status === 'draft' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                            quotation.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                'bg-blue-100 text-blue-800 border-blue-200'
                        }`}>
                        {quotation.status.toUpperCase()}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Print / PDF</Button>
                    {quotation.status === 'draft' && (
                        <Button>Mark as Sent</Button>
                    )}
                    {quotation.status === 'sent' && (
                        <Button className="bg-green-600 hover:bg-green-700">Approve & Convert to Invoice</Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <p className="font-semibold text-lg">{quotation.customer?.name}</p>
                            <p className="text-slate-500">{quotation.customer?.email}</p>
                            <p className="text-slate-500 whitespace-pre-line">{quotation.customer?.address}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Date</span>
                            <span>{new Date(quotation.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Valid Until</span>
                            <span>{quotation.valid_until ? new Date(quotation.valid_until).toLocaleDateString() : '-'}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b">
                                <th className="h-10 px-4 font-medium">Product</th>
                                <th className="h-10 px-4 font-medium text-right">Price</th>
                                <th className="h-10 px-4 font-medium text-right">Qty</th>
                                <th className="h-10 px-4 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotation.items?.map((item) => (
                                <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50/50">
                                    <td className="p-4">{item.product?.name} <span className="text-slate-400 text-xs ml-2">{item.product?.sku}</span></td>
                                    <td className="p-4 text-right">${item.unit_price.toLocaleString()}</td>
                                    <td className="p-4 text-right">{item.quantity}</td>
                                    <td className="p-4 text-right font-medium">${item.total_price.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3} className="p-4 text-right font-bold text-lg">Total Amount</td>
                                <td className="p-4 text-right font-bold text-lg">${quotation.total_amount.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
