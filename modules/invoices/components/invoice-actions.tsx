'use client';

import { Printer, Download, Edit, CheckCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';
import { RefObject, useState } from 'react';
import { invoiceService } from '../services';
import { releaseOrderService } from '@/modules/release-orders/services';
import { useRouter } from 'next/navigation';

interface InvoiceActionsProps {
    invoiceId: string;
    printRef: RefObject<HTMLDivElement | null>;
    status?: string;
}

export function InvoiceActions({ invoiceId, printRef, status }: InvoiceActionsProps) {
    const router = useRouter();
    const [updating, setUpdating] = useState(false);
    const [generating, setGenerating] = useState(false);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Invoice-${invoiceId}`,
    });

    const markAsPaid = async () => {
        setUpdating(true);
        try {
            await invoiceService.updateStatus(invoiceId, 'paid');
            router.refresh(); // Refresh current page to show updated status
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const handleCreateReleaseOrder = async () => {
        setGenerating(true);
        try {
            const values = await releaseOrderService.generateFromInvoice(invoiceId);
            const ro = await releaseOrderService.createReleaseOrder(values);
            router.push(`/release-order/${ro.id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to create release order');
        } finally {
            setGenerating(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;
        setGenerating(true);
        try {
            // @ts-ignore - html2pdf might not have types installed
            const html2pdf = (await import('html2pdf.js')).default;
            const element = printRef.current;
            const opt = {
                margin: 0,
                filename: `Invoice-${invoiceId}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="flex gap-2 justify-end print:hidden">
            {status === 'paid' && (
                <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleCreateReleaseOrder}
                    disabled={generating}
                >
                    <Truck className="mr-2 h-4 w-4" />
                    {generating ? 'Creating...' : 'Create Release Order'}
                </Button>
            )}
            {status !== 'paid' && (
                <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={markAsPaid}
                    disabled={updating}
                >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {updating ? 'Updating...' : 'Mark as Paid'}
                </Button>
            )}
            <Button variant="outline" size="sm" asChild>
                <Link href={`/invoices/${invoiceId}/edit`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePrint()}>
                <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button size="sm" onClick={handleDownloadPDF} disabled={generating}>
                <Download className="mr-2 h-4 w-4" />
                {generating ? 'Generating...' : 'Download PDF'}
            </Button>
        </div>
    );
}
