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
    invoiceNumber: string;
    printRef: RefObject<HTMLDivElement | null>;
    status?: string;
}

export function InvoiceActions({ invoiceId, invoiceNumber, printRef, status }: InvoiceActionsProps) {
    const router = useRouter();
    const [updating, setUpdating] = useState(false);
    const [generating, setGenerating] = useState(false);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: invoiceNumber || `Invoice-${invoiceId}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 15mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    font-family: 'Helvetica', Arial, sans-serif !important;
                }
                #invoice-template {
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                    font-size: 9pt !important;
                }
                /* Ensure watermark is visible but subtle */
                .opacity-\\[0\\.06\\] {
                    opacity: 0.06 !important;
                }
            }
        `
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
            // Using html2pdf.js for better A4 scaling and reliability
            const html2pdf = (await import('html2pdf.js' as any)).default;
            
            const element = printRef.current;
            
            // Temporary styles to ensure perfect A4 capture
            const originalStyle = element.style.cssText;
            element.style.width = '210mm';
            element.style.maxWidth = 'none';
            element.style.height = 'auto';
            element.style.margin = '0';
            element.style.padding = '0';
            element.style.boxShadow = 'none';
            element.style.backgroundColor = '#ffffff';

            const opt = {
                margin: 0,
                filename: `${invoiceNumber || 'Invoice'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    letterRendering: true,
                    windowWidth: 1200 
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            };

            await html2pdf().from(element).set(opt).save();

            // Restore original style
            element.style.cssText = originalStyle;
        } catch (error) {
            console.error('PDF Download Error:', error);
            alert('PDF generate failed. Please use Print -> Save as PDF as a backup.');
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
