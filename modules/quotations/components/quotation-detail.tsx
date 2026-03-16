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

    const print = () => {
        window.print();
    };

    return (
        <div className="space-y-6 print:space-y-0">
            {/* Action Bar - Hidden when printing */}
            <div className="flex items-center gap-4 justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/quotations/list">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">Quotation View</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={print}>Print / Save as PDF</Button>
                    {quotation.status === 'draft' && (
                        <Button>Mark as Sent</Button>
                    )}
                    {quotation.status === 'sent' && (
                        <Button className="bg-green-600 hover:bg-green-700">Approve & Convert</Button>
                    )}
                </div>
            </div>

            {/* A4 Paper Container */}
            <div className="max-w-[210mm] mx-auto bg-white p-[10mm] shadow-lg print:shadow-none print:p-0 print:mx-0 print:w-full text-black">

                {/* Header Section */}
                <div className="flex justify-between items-start mb-8">
                    <div className="w-1/2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-purple-900 text-white p-1 rounded-sm">
                                <span className="font-bold text-xl leading-none">✔</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-purple-900 leading-none">Permit</h1>
                                <h1 className="text-2xl font-bold text-purple-900 leading-none">Declaration</h1>
                            </div>
                        </div>
                        <div className="text-sm font-bold">Deal Universal Services Pte Ltd</div>
                        <div className="text-xs">
                            715 CLEMENTI WEST STREET 2, #05-<br />
                            69, VISTA 18, SINGAPORE 120715
                        </div>
                    </div>
                    <div className="w-1/2 text-right text-sm">
                        <div className="grid grid-cols-[1fr_auto] gap-x-2">
                            <span className="font-bold">Quotation No:</span>
                            <span>{quotation.quotation_number || "CL/2026/92"}</span>
                            <span className="font-bold">Date:</span>
                            <span>{new Date(quotation.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                {/* Attention Block */}
                <div className="mb-6 text-sm">
                    <div className="grid grid-cols-[50px_1fr] gap-y-1">
                        <span className="font-bold">Attn</span>
                        <span className="font-bold">: {quotation.customer?.company_name || "Mr Navas"}</span>
                        <span className="font-bold">Tele</span>
                        <span className="font-bold">: {quotation.customer?.phone || "+65 9893 3211"}</span>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-4">
                    <h2 className="text-lg font-bold underline decoration-2 underline-offset-4">OFFICIAL QUOTATION – Using CHOLA OWN ID</h2>
                </div>

                {/* Main Table */}
                <div className="border border-black mb-4">
                    <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr] text-sm font-bold text-center border-b border-black bg-gray-50">
                        <div className="p-2 border-r border-black">Permit Types</div>
                        <div className="p-2 border-r border-black">Volume / Month</div>
                        <div className="p-2 border-r border-black">Permit Charges</div>
                        <div className="p-2">Remarks</div>
                    </div>

                    {quotation.items && quotation.items.length > 0 ? (
                        quotation.items.map((item: any, index: number) => (
                            <div key={item.id} className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr] text-sm items-center border-b border-black last:border-b-0 min-h-[60px]">
                                <div className="p-2 border-r border-black h-full flex items-center justify-center text-center">{item.product?.name || "All Export Permits"}</div>
                                <div className="p-2 border-r border-black h-full flex items-center justify-center">-</div>
                                <div className="p-2 border-r border-black h-full flex items-center justify-center">{item.unit_price ? `${Number(item.unit_price).toFixed(2)} SGD` : "18.00 SGD"}</div>
                                <div className="p-2 h-full flex items-center justify-center text-emerald-500 font-bold text-xs">*SPECIAL RATES*</div>
                            </div>
                        ))
                    ) : (
                        // Fallback rows if no items
                        <>
                            <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr] text-sm items-center border-b border-black min-h-[60px]">
                                <div className="p-2 border-r border-black h-full flex items-center justify-center text-center">All Export Permits</div>
                                <div className="p-2 border-r border-black h-full flex items-center justify-center">-</div>
                                <div className="p-2 border-r border-black h-full flex items-center justify-center">18.00 SGD</div>
                                <div className="p-2 h-full flex items-center justify-center text-emerald-500 font-bold text-xs">*SPECIAL RATES*</div>
                            </div>
                            <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr] text-sm items-center border-b border-black min-h-[60px]">
                                <div className="p-2 border-r border-black h-full flex items-center justify-center text-center">All Import Permits</div>
                                <div className="p-2 border-r border-black h-full flex items-center justify-center">-</div>
                                <div className="p-2 border-r border-black h-full flex items-center justify-center">18.00 SGD</div>
                                <div className="p-2 h-full flex items-center justify-center text-emerald-500 font-bold text-xs">*SPECIAL RATES*</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Additional Charges Banner */}
                <div className="text-center font-bold text-sm mb-6 pb-4 border-b-2 border-transparent">
                    <p>IOR/EOR - USING CHOLA UEN : 30/- PER APPLICATION</p>
                    <p>USING CHOLA SFA LICENSE : 30/- PER APPLICATION</p>
                </div>

                {/* Item Charges */}
                <div className="mb-6 text-sm">
                    <h3 className="font-bold mb-1">Item Charges</h3>
                    <p>1st to 5th items No Charges</p>
                    <p>From 6th items onwards additional charge SGD 0.50cents per item</p>
                </div>

                {/* Turn Around Time Table */}
                <div className="mb-8">
                    <h3 className="font-bold text-center mb-2 uppercase text-sm">OUR TAT (TURN-AROUND TIME)</h3>
                    <table className="w-full border-collapse border border-black text-sm">
                        <tbody>
                            <tr>
                                <td className="border border-black p-1 font-bold bg-gray-50 w-1/2">Priority :</td>
                                <td className="border border-black p-1 font-bold bg-gray-50 w-1/2">Permit Returning Timings :</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1">Normal Requests</td>
                                <td className="border border-black p-1">Within 60mins of Request</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1">Urgent Requests</td>
                                <td className="border border-black p-1">Within 30mins of Request</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1">Tier1/Control countries/Other Controlling Agencies</td>
                                <td className="border border-black p-1">Depending upon the Customs queue</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Procedures */}
                <div className="mb-6 text-sm">
                    <h3 className="font-bold mb-2">Procedures:</h3>
                    <ol className="list-[lower-alpha] pl-5 space-y-2">
                        <li>
                            Email us a copy of the Commercial Invoice, Packing List and Air waybill (AWB) or Ocean Bill of lading (OBL) Notice of Arrival (NOA)<br />
                            Email: <a href="mailto:ops@permitdeclaration.com.sg" className="text-blue-600 underline">ops@permitdeclaration.com.sg</a> CC: <a href="mailto:Permitdeclaration@gmail.com" className="text-blue-600 underline">Permitdeclaration@gmail.com</a>
                        </li>
                        <li>We will process your application when we receive the documents from your company.</li>
                        <li>We will forward you the approved permit(s) through e-mail within the same day</li>
                    </ol>
                </div>

                {/* Operating Hours */}
                <div className="mb-6 text-sm">
                    <h3 className="font-bold mb-2">Our Operating Hours:</h3>
                    <div className="grid grid-cols-[180px_1fr] items-center">
                        <span className="font-bold">Operation Office Hours:</span>
                        <span><span className="font-bold text-xs">24/7 (365 DAYS)</span> WhatsApp [ +65 90144400 ] for 24/7 assistance.</span>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-8 text-sm">
                    <h3 className="font-bold mb-2">Terms & Conditions :</h3>
                    <ul className="list-disc pl-5 space-y-1 marker:text-black">
                        <li>Payment Terms ( for Permit Declaration Charges) : 07 days from date of invoice.</li>
                        <li>Please note quoted rates do not apply to CMB / PCD /SCDF controlled products. Valid License must be obtained from the relevant authorities prior to the exportation and permit declaration for such items.</li>
                        <li>Import GST shall pay directly to Singapore Customs at their dedicated bank i.e. UOB prior utilization of our import permit before cargo clearance.</li>
                        <li>Quotation Validity: 10 days from date of our quotation.</li>
                    </ul>
                </div>

                {/* Closing & Signature */}
                <div className="mt-8 text-sm">
                    <p className="mb-8">We trust that the above suits your requirements and we look forward to be your declaring agent for all your valuable shipments.</p>

                    <div className="mt-8">
                        <p className="mb-4">Best Regards</p>
                        {/* Signature Placeholder - using a font to simulate or just space */}
                        <div className="h-16 mb-2">
                            <span className="font-['Brush_Script_MT'] text-3xl italic">Balu</span>
                            {/* In a real app, use an image <img src="/signature.png" className="h-16" alt="Signature" /> */}
                        </div>
                        <p className="font-bold">Balu Venkatesh</p>
                        <p>Director</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
