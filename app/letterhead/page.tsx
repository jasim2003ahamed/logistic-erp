'use client';

import { LetterheadTemplate } from '@/modules/letterhead/components/letterhead-template';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function LetterheadPage() {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: 'Company-Letterhead',
        pageStyle: `
            @page {
                size: A4;
                margin: 0;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Company Letterhead</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handlePrint()}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 min-h-[1123px] flex justify-center overflow-auto">
                <div ref={printRef} className="print:m-0">
                    <LetterheadTemplate />
                </div>
            </div>
        </div>
    );
}
