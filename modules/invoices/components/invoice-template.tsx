import { Invoice } from '../types';

interface InvoiceTemplateProps {
    invoice: Invoice;
}

export function InvoiceTemplate({ invoice }: InvoiceTemplateProps) {
    return (
        <div className="bg-white p-8 md:p-12 max-w-4xl mx-auto shadow-sm print:shadow-none print:p-0" id="invoice-template">
            {/* Header / Letterhead */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-14 w-14 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xl">
                            LG
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">LOGISTICS ERP</h1>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">International Freight Forwarders</p>
                        </div>
                    </div>
                    <div className="text-xs text-slate-600 space-y-0.5">
                        <p className="font-bold text-slate-900 uppercase">Registered Office:</p>
                        <p>123 Logistics Plaza, Air Cargo Road</p>
                        <p>New Delhi, Delhi - 110037, India</p>
                        <p>Phone: +91 11 2345 6789 | Email: finance@logistics.com</p>
                        <p className="font-bold text-slate-900 mt-2">GSTIN: 07AAAAA0000A1Z5</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase italic">Invoice</h2>
                    <div className="space-y-1.5 text-xs">
                        <div className="flex justify-end gap-3">
                            <span className="text-slate-500 font-medium uppercase tracking-wider">Invoice No:</span>
                            <span className="font-bold text-slate-900">#{invoice.invoice_number}</span>
                        </div>
                        <div className="flex justify-end gap-3">
                            <span className="text-slate-500 font-medium uppercase tracking-wider">Issue Date:</span>
                            <span className="font-bold text-slate-900">{new Date(invoice.issue_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        {invoice.due_date && (
                            <div className="flex justify-end gap-3 text-red-600">
                                <span className="font-medium uppercase tracking-wider">Due Date:</span>
                                <span className="font-bold">{new Date(invoice.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                        )}
                        <div className="flex justify-end gap-3">
                            <span className="text-slate-500 font-medium uppercase tracking-wider">Status:</span>
                            <span className={`capitalize font-bold px-2 py-0.5 rounded ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                {invoice.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bill To & Details Section */}
            <div className="grid grid-cols-2 gap-12 mb-10">
                <div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-3 border-b border-slate-100 pb-1">Billed To</h3>
                    <div className="text-slate-900">
                        <p className="font-black text-lg leading-tight mb-1">{invoice.customer?.name}</p>
                        {invoice.customer?.address && (
                            <p className="whitespace-pre-line text-xs text-slate-600 leading-relaxed mb-1">{invoice.customer.address}</p>
                        )}
                        {invoice.customer?.email && (
                            <p className="text-xs text-blue-600 font-medium">{invoice.customer.email}</p>
                        )}
                    </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-3 border-b border-slate-200 pb-1">Shipment Info</h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Quotation Ref:</span>
                            <span className="font-bold text-slate-900">{invoice.quotation_id ? 'QT-' + invoice.quotation_id.slice(0, 5).toUpperCase() : 'Direct Billing'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Payment Mode:</span>
                            <span className="font-bold text-slate-900 uppercase tracking-tighter">Bank Transfer / Check</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-10 overflow-hidden border border-slate-200 rounded-lg">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-slate-900 text-white uppercase tracking-wider">
                            <th className="py-3 px-4 text-left font-bold">#</th>
                            <th className="py-3 px-4 text-left font-bold">Item Description</th>
                            <th className="py-3 px-4 text-right font-bold w-20">Qty</th>
                            <th className="py-3 px-4 text-right font-bold w-28">Price</th>
                            <th className="py-3 px-4 text-right font-bold w-32 text-white">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoice.items?.map((item, index) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-4 text-slate-400 font-medium">{index + 1}</td>
                                <td className="py-4 px-4">
                                    <p className="font-bold text-slate-900">{item.description}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">HSN Code: 996511</p>
                                </td>
                                <td className="py-4 px-4 text-right text-slate-600 font-medium">{item.quantity}</td>
                                <td className="py-4 px-4 text-right text-slate-600 font-medium font-mono">₹{item.unit_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td className="py-4 px-4 text-right font-black text-slate-900 font-mono">₹{item.total_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals & Notes Area */}
            <div className="grid grid-cols-2 gap-12">
                <div>
                    {invoice.notes && (
                        <div className="mb-6">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Internal Notes</h4>
                            <p className="text-xs text-slate-500 leading-relaxed italic">{invoice.notes}</p>
                        </div>
                    )}
                    <div className="bg-blue-50 p-4 rounded border border-blue-100">
                        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">Bank Details (NEFT/IMPS)</h4>
                        <div className="text-[10px] text-blue-700 space-y-1 font-medium">
                            <p className="flex justify-between"><span>Bank Name:</span> <span className="font-bold uppercase text-blue-900">Standard Chartered Bank</span></p>
                            <p className="flex justify-between"><span>Account Name:</span> <span className="font-bold uppercase text-blue-900">Logistics ERP Solutions</span></p>
                            <p className="flex justify-between"><span>A/C Number:</span> <span className="font-bold uppercase text-blue-900">9876543210</span></p>
                            <p className="flex justify-between"><span>IFSC Code:</span> <span className="font-bold uppercase text-blue-900">SCBL0004567</span></p>
                        </div>
                    </div>
                </div>
                <div className="space-y-2 border-t-2 border-slate-900 pt-4">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>SUB-TOTAL AMOUNT</span>
                        <span className="font-mono text-slate-900">₹{invoice.subtotal_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>GST ({invoice.tax_rate || 0}%)</span>
                        <span className="font-mono text-slate-900">₹{invoice.tax_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-white bg-slate-900 px-4 py-3 rounded-md mt-4">
                        <span className="italic tracking-tighter">GRAND TOTAL</span>
                        <span className="font-mono tracking-tighter">₹{invoice.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 italic text-right mt-2 uppercase font-bold tracking-tighter">Amount in words: Indian Rupees Only</p>
                </div>
            </div>

            {/* Signature Section */}
            <div className="mt-16 pt-16 grid grid-cols-2 gap-12 border-t border-slate-50">
                <div className="text-left flex flex-col justify-end">
                    <div className="border-b border-slate-200 w-48 mb-2"></div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Customer Signature</p>
                    <p className="text-[9px] text-slate-400 italic mt-0.5">I agree to the terms listed above</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-16">For LOGISTICS ERP SOLUTIONS</p>
                    <div className="flex flex-col items-end">
                        <div className="border-b-2 border-slate-900 w-56 mb-2"></div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Authorized Signatory</p>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[4px]">Computer Generated Document - No Signature Required</p>
            </div>
        </div>
    );
}
