import { Invoice } from '../types';

interface InvoiceTemplateProps {
    invoice: Invoice;
}

export function InvoiceTemplate({ invoice }: InvoiceTemplateProps) {
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString('en-SG', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
    };

    const formatAmount = (amount: number, currency: string = 'SGD') => {
        return amount.toLocaleString('en-SG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const numberToWords = (num: number) => {
        const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        const b = ['', '', 'twenty ', 'thirty ', 'forty ', 'fifty ', 'sixty ', 'seventy ', 'eighty ', 'ninety '];

        const convert = (n: number): string => {
            if (n < 20) return a[n];
            if (n < 100) return b[Math.floor(n / 10)] + a[n % 10];
            if (n < 1000) return a[Math.floor(n / 100)] + 'hundred ' + (n % 100 !== 0 ? 'and ' + convert(n % 100) : '');
            if (n < 1000000) return convert(Math.floor(n / 1000)) + 'thousand ' + (n % 1000 !== 0 ? convert(n % 1000) : '');
            if (n < 1000000000) return convert(Math.floor(n / 1000000)) + 'million ' + (n % 1000000 !== 0 ? convert(n % 1000000) : '');
            return '';
        };

        if (num === 0) return 'zero';

        let main = Math.floor(num);
        let cents = Math.round((num - main) * 100);

        let result = convert(main);
        let centsText = '';
        if (cents > 0) {
            centsText = ' and ' + convert(cents).trim() + ' cents';
        }
        return (result.trim() + centsText + ' only').toUpperCase();
    };

    return (
        <div className="bg-white mx-auto shadow-2xl print:shadow-none text-[7pt] text-[#082645] leading-snug font-['Helvetica',_Arial,_sans-serif] antialiased relative overflow-hidden [print-color-adjust:exact] w-[210mm] min-h-[297mm] h-[297mm]" id="invoice-template">
            <style dangerouslySetInnerHTML={{
                __html: `
                @page { 
                    size: A4; 
                    margin: 0; 
                }
                #invoice-template::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 190mm;
                    height: 190mm;
                    background-image: url('/logo.png');
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                    opacity: 0.08;
                    filter: grayscale(1);
                    pointer-events: none;
                    z-index: 50;
                }
                @media print {
                    #invoice-template {
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    #invoice-template::after {
                        opacity: 0.03;
                        filter: grayscale(1);
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            ` }} />
            <div className="relative z-10 flex flex-col h-full p-[5mm]">
                {/* Header / Letterhead */}
                <div className="mb-2">
                    <div className="flex flex-col items-center mb-2">
                        <img
                            src="/logo.png"
                            alt="Deal Universal Services Logo"
                            className="h-14 w-auto mb-1 object-contain"
                        />
                        <div className="text-center">
                            <div className="text-[6.5pt] space-y-0.5 mt-1 text-[#64748b]">
                                <p className="font-black">
                                    <span className="font-bold text-[#082645] uppercase tracking-tighter text-[6pt]">UEN:</span> 202550289G
                                </p>
                                <p className="font-black">
                                    <span className="font-bold text-[#082645] uppercase tracking-tighter text-[6pt]">Address:</span> 715 CLEMENTI WEST STREET 2, #05-69, VISTA 18, SINGAPORE 120715
                                </p>
                                <p className="font-black">
                                    <span className="font-bold text-[#082645] uppercase tracking-tighter text-[6pt]">Tel:</span> <span className="tabular-nums">+65 9893 3211</span>, <span className="tabular-nums">+65 8332 1063</span> |
                                    <span className="font-bold text-[#082645] uppercase tracking-tighter text-[6pt]"> Email:</span> info@dealuniversal.com |
                                    <span className="font-bold text-[#082645] uppercase tracking-tighter text-[6pt]"> Web:</span> dealuniversal.com
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-y-2 border-[#082645] py-0.5 mb-1.5 bg-[#f8fafc]/30">
                        <h2 className="text-center text-[10pt] font-black tracking-[4px] uppercase text-[#082645]">INVOICE</h2>
                    </div>

                    <div className="mb-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 border border-[#e2e8f0] p-1 bg-[#f8fafc]/80">
                            <p className="flex items-center gap-1.5">
                                <span className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-wider">INVOICE NO:</span>
                                <span className="font-black text-[6.5pt] text-[#082645] tabular-nums">{invoice.invoice_number}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                                <span className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-wider">DATE:</span>
                                <span className="font-bold text-[6pt] text-[#082645] tabular-nums">{formatDate(invoice.issue_date)}</span>
                            </p>
                            {invoice.due_date && (
                                <p className="flex items-center gap-1.5">
                                    <span className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-wider">DUE DATE:</span>
                                    <span className="font-bold text-[6pt] text-[#082645] tabular-nums">{formatDate(invoice.due_date)}</span>
                                </p>
                            )}
                            {invoice.job_number && (
                                <p className="flex items-center gap-1.5">
                                    <span className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-wider">JOB NO:</span>
                                    <span className="font-bold text-[6pt] text-[#082645] tabular-nums">{invoice.job_number}</span>
                                </p>
                            )}
                            {invoice.terms && (
                                <p className="flex items-center gap-1.5">
                                    <span className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-wider">TERMS:</span>
                                    <span className="font-bold text-[6pt] text-[#082645]">{invoice.terms}</span>
                                </p>
                            )}

                            {invoice.parent_invoice_id && (
                                <p className="flex items-center gap-1.5">
                                    <span className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-wider">RELATED:</span>
                                    <span className="font-bold text-[6pt] text-[#082645] tabular-nums">{invoice.parent_invoice_id}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Primary Info - Row 2: Customer & Bank */}
                    <div className="grid grid-cols-12 gap-2 items-start mb-2">
                        <div className="col-span-6">
                            <div className="h-full border border-[#e2e8f0] p-2 bg-white">
                                <h3 className="font-black border-b border-[#082645] pb-0.5 mb-1 uppercase text-[6pt] tracking-widest text-[#082645]">BILL TO:</h3>
                                <div className="space-y-0">
                                    <p className="font-black text-[8pt] text-[#082645] uppercase mb-0.5">{invoice.customer?.company_name}</p>
                                    <p className="whitespace-pre-line leading-snug text-[#475569] mb-1.5 text-[7pt]">{invoice.customer?.address}</p>
                                    <div className="grid grid-cols-1 gap-y-0 pt-1 border-t border-[#f1f5f9]">
                                        <p className="flex"><span className="font-black font-bold text-[#94a3b8] uppercase text-[5.5pt] w-14">UEN:</span> <span className="font-black font-bold text-[#082645]">{invoice.customer?.uen || '-'}</span></p>
                                        <p className="flex"><span className="font-black font-bold text-[#94a3b8] uppercase text-[5.5pt] w-14">ATTN:</span> <span className="font-black font-bold text-[#082645]">{invoice.customer?.attend_name || '-'}</span></p>
                                        <p className="flex"><span className="font-black font-bold text-[#94a3b8] uppercase text-[5.5pt] w-14">TEL:</span> <span className="font-black font-bold text-[#082645]">{invoice.customer?.phone || '-'}</span></p>
                                        <p className="flex"><span className="font-black font-bold text-[#94a3b8] uppercase text-[5.5pt] w-14">EMAIL:</span> <span className="font-black font-bold text-[#082645]">{invoice.customer?.company_email || '-'}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-6 border border-[#e2e8f0] p-2 bg-white h-full">
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                    <h3 className="font-black text-[6pt] text-[#082645] border-[#082645] tracking-widest uppercase mb-1 border-b pb-0.5">BANK DETAILS</h3>
                                    <div className="space-y-0.5 text-[7pt]">
                                        <p className="flex flex-col">
                                            <span className="font-black uppercase text-[5pt] text-[#94a3b8] tracking-wider">Bank Name</span>
                                            <span className="font-bold text-[#082645]">DBS BANK LTD</span>
                                        </p>
                                        <p className="flex flex-col">
                                            <span className="font-black uppercase text-[5pt] text-[#94a3b8] tracking-wider">Account Name</span>
                                            <span className="font-bold text-[#082645] uppercase leading-tight tracking-tight">Deal Universal Services PTE LTD</span>
                                        </p>
                                        <p className="flex flex-col">
                                            <span className="font-black uppercase text-[5pt] text-[#94a3b8] tracking-wider">Account Number</span>
                                            <span className="font-bold text-[#082645] tabular-nums tracking-[0.5px]">0721434237</span>
                                        </p>
                                        <p className="flex flex-col">
                                            <span className="font-black uppercase text-[5pt] text-[#94a3b8] tracking-wider">SWIFT/BIC Code</span>
                                            <span className="font-bold text-[#082645] tracking-[0.5px]">DBSSSGSG</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 mt-2">
                                    <p className="text-[5.5pt] font-black text-[#082645] uppercase tracking-widest">Scan to pay</p>
                                    <div className="w-16 h-16 bg-white p-1 border border-[#e2e8f0] rounded-sm shadow-inner">
                                        <img src="/qr.jpeg" alt="PayNow QR" className="w-full h-full object-contain" />
                                    </div>
                                    <p className="text-[6pt] font-black text-[#082645] bg-white px-1 py-0.5 rounded border border-[#e2e8f0] uppercase tracking-tighter text-center">UEN: 202550289G</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipment & Vessel Details Grid */}
                {(() => {
                    const isAir = invoice.service_modes?.includes('Air Freight');
                    const isSea = invoice.service_modes?.some(m => m.includes('Sea Freight') || m.includes('Cross Trade'));
                    const isRoad = invoice.service_modes?.some(m => m.includes('Road Freight') || m.includes('Warehouse') || m.includes('Customs'));
                    const isShipSpares = invoice.service_modes?.some(m => m.includes('Ship Spares') || m.includes('Provisions'));

                    const airDetails = [
                        { label: 'MAWB NO', value: invoice.mbl_mawb },
                        { label: 'HAWB NO', value: invoice.hbl_hawb },
                        { label: 'FLIGHT NAME', value: invoice.vessel_flight },
                        { label: 'FLIGHT NO', value: invoice.voyage_no },
                        { label: 'AIRPORT OF LOADING', value: invoice.pol },
                        { label: 'AIRPORT OF DISCHARGE', value: invoice.pod },
                        { label: 'DEPARTURE', value: invoice.etd ? formatDate(invoice.etd) : null },
                        { label: 'ARRIVAL', value: invoice.eta ? formatDate(invoice.eta) : null },
                    ].filter(d => d.value && d.value !== '-' && d.value !== '');

                    const seaDetails = [
                        { label: 'MBL NO', value: invoice.mbl_mawb },
                        { label: 'HBL NO', value: invoice.hbl_hawb },
                        { label: 'VESSEL NAME', value: invoice.vessel_flight },
                        { label: 'VOYAGE NO', value: invoice.voyage_no },
                        { label: 'PORT OF LOADING (POL)', value: invoice.pol },
                        { label: 'PORT OF DISCHARGE (POD)', value: invoice.pod },
                        { label: 'ETD', value: invoice.etd ? formatDate(invoice.etd) : null },
                        { label: 'ETA', value: invoice.eta ? formatDate(invoice.eta) : null },
                        { label: 'IMO NO', value: !isShipSpares ? invoice.imo_no : null },
                        { label: 'BERTH / ANCHORAGE', value: !isShipSpares ? invoice.berth_anchorage : null },
                    ].filter(d => d.value && d.value !== '-' && d.value !== '');

                    const shipSparesDetails = [
                        { label: 'VESSEL NAME (SUPPLY)', value: invoice.imo_no },
                        { label: 'PORT OF LOADING (SUPPLY)', value: invoice.berth_anchorage },
                        { label: 'PORT OF DISCHARGE (SUPPLY)', value: invoice.vessel_pod },
                        { label: 'DELIVERY DATE', value: invoice.vessel_delivery_date ? formatDate(invoice.vessel_delivery_date) : null },
                    ].filter(d => d.value && d.value !== '-' && d.value !== '');

                    const logisticsDetails = [
                        { label: 'TRUCK / VEHICLE NO', value: invoice.vessel_flight },
                        { label: 'COLLECTION ADDRESS', value: invoice.pol },
                        { label: 'DELIVERY ADDRESS', value: invoice.delivery_address },
                        { label: 'DELIVERY DATE', value: invoice.vessel_delivery_date ? formatDate(invoice.vessel_delivery_date) : null },
                    ].filter(d => d.value && d.value !== '-' && d.value !== '');

                    const cargoDetails = [
                        { label: 'SHIPMENT TYPE', value: invoice.shipment_type },
                        { label: 'HS CODE', value: invoice.hs_code },
                        { label: 'COMMODITY', value: invoice.commodity },
                        { label: 'NO. OF PACKAGES', value: invoice.num_packages },
                        { label: 'GROSS WEIGHT (KGS)', value: invoice.gross_weight },
                        { label: 'VOLUME (CBM)', value: invoice.volume },
                        { label: 'CONTAINER TYPE', value: invoice.container_type },
                        { label: 'TEMPERATURE (°C)', value: invoice.temperature ? `${invoice.temperature}°C` : null },
                        { label: 'FINAL DELIVERY ADDRESS', value: !isRoad ? invoice.delivery_address : null },
                    ].filter(d => d.value && d.value !== '-' && d.value !== '');

                    const showAir = isAir || (airDetails.length > 0 && !isSea && !isShipSpares && !isRoad);
                    const showSea = isSea || (seaDetails.length > 0 && !isAir && !isShipSpares && !isRoad);
                    const showShip = isShipSpares || (shipSparesDetails.length > 0 && !isAir && !isSea && !isRoad);
                    const showRoad = isRoad || (logisticsDetails.length > 0 && !isAir && !isSea && !isShipSpares);

                    const isUnified = !isAir && !isSea && !isShipSpares && !isRoad;
                    if (isUnified && airDetails.length === 0 && seaDetails.length === 0 && shipSparesDetails.length === 0 && logisticsDetails.length === 0 && cargoDetails.length === 0) return null;

                    const activeModeCount = [showAir, showSea, showShip, showRoad].filter(Boolean).length;
                    const sectionSpan = activeModeCount === 1 ? 'col-span-2' : 'col-span-1';


                    return (
                        <div className="mb-2 overflow-hidden border border-[#e2e8f0]">
                            {/* Mode of Service — inside the shipment block */}
                            {invoice.service_modes && invoice.service_modes.length > 0 && (
                                <div className="p-1.5 border-b border-[#e2e8f0] bg-[#f8fafc]/80">
                                    <label className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-widest block mb-0.5 px-1">MODE OF SERVICE</label>
                                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 px-1">
                                        {invoice.service_modes.map((mode) => (
                                            <div key={mode} className="flex items-center gap-1">
                                                <div className="w-2.5 h-2.5 rounded flex-shrink-0 flex items-center justify-center bg-[#082645]">
                                                    <svg width="7" height="5" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <span className="text-[6.5pt] font-black text-[#082645] uppercase">{mode}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="p-2 bg-white space-y-2">
                                <div className="grid grid-cols-1 gap-y-2">
                                    {/* Air Freight Section */}
                                    {showAir && airDetails.length > 0 && (
                                        <div className="pb-1.5 border-b border-[#f1f5f9] last:border-b-0">
                                            <h4 className="text-[6pt] font-black text-[#64748b] mb-1 uppercase tracking-widest flex items-center gap-1.5">
                                                <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                                                {isAir ? 'Air Freight Details' : 'Shipment Details (Air)'}
                                            </h4>
                                            <div className="grid grid-cols-4 gap-x-2 gap-y-1">
                                                {airDetails.map((detail, idx) => (
                                                    <div key={idx} className="flex flex-col">
                                                        <span className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-wider">{detail.label}</span>
                                                        <span className="text-[7pt] font-black text-[#082645] uppercase tabular-nums leading-tight">{detail.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sea Freight Details */}
                                    {showSea && seaDetails.length > 0 && (
                                        <div className="pb-1.5 border-b border-[#f1f5f9] last:border-b-0">
                                            <h4 className="text-[6pt] font-black text-[#64748b] mb-1 uppercase tracking-widest flex items-center gap-1.5">
                                                <span className="w-1 h-1 rounded-full bg-cyan-600"></span>
                                                {isSea ? 'Sea Freight Details' : 'Shipment Details (Sea)'}
                                            </h4>
                                            <div className="grid grid-cols-4 gap-x-2 gap-y-1">
                                                {seaDetails.map((detail, idx) => (
                                                    <div key={idx} className="flex flex-col">
                                                        <span className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-wider">{detail.label}</span>
                                                        <span className="text-[7pt] font-black text-[#082645] uppercase tabular-nums leading-tight">{detail.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Ship Spares / Supply Section */}
                                    {showShip && shipSparesDetails.length > 0 && (
                                        <div className="pb-1.5 border-b border-[#f1f5f9] last:border-b-0">
                                            <h4 className="text-[6pt] font-black text-[#64748b] mb-1 uppercase tracking-widest flex items-center gap-1.5">
                                                <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                                                {isShipSpares ? 'Ship Spares / Vessel Supply' : 'Vessel Supply Details'}
                                            </h4>
                                            <div className="grid grid-cols-4 gap-x-2 gap-y-1">
                                                {shipSparesDetails.map((detail, idx) => (
                                                    <div key={idx} className="flex flex-col">
                                                        <span className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-wider">{detail.label}</span>
                                                        <span className="text-[7pt] font-black text-[#082645] uppercase tabular-nums leading-tight">{detail.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Logistics / Warehouse / Road Section */}
                                    {showRoad && logisticsDetails.length > 0 && (
                                        <div className="pb-1.5 border-b border-[#f1f5f9] last:border-b-0">
                                            <h4 className="text-[6pt] font-black text-[#64748b] mb-1 uppercase tracking-widest flex items-center gap-1.5">
                                                <span className="w-1 h-1 rounded-full bg-orange-500"></span>
                                                Logistics / Road Details
                                            </h4>
                                            <div className="grid grid-cols-4 gap-x-2 gap-y-1">
                                                {logisticsDetails.map((detail, idx) => (
                                                    <div key={idx} className="flex flex-col">
                                                        <span className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-wider">{detail.label}</span>
                                                        <span className="text-[7pt] font-black text-[#082645] uppercase tabular-nums leading-tight">{detail.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* General Cargo Specifications */}
                                {cargoDetails.length > 0 && (
                                    <div className="pt-2 border-t border-[#f1f5f9]">
                                        <h4 className="text-[6pt] font-black text-[#64748b] mb-1.5 uppercase tracking-[2px] text-center">General Cargo Specifications</h4>
                                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 gap-y-3">
                                            {cargoDetails.map((detail, idx) => (
                                                <div key={idx} className="flex flex-col items-center text-center">
                                                    <span className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-widest leading-tight h-2.5">{detail.label}</span>
                                                    <span className="text-[7pt] font-black text-[#082645] uppercase leading-tight tabular-nums">{detail.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}

                {/* Charges Table */}
                <div className="mb-2 overflow-hidden border-2 border-[#082645]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#082645] text-[#ffffff] uppercase font-black text-[7pt] tracking-widest">
                                <th className="py-1 px-2 text-left w-10 border-r border-[#082645]/20">ITEM</th>
                                <th className="py-1 px-3 text-left">DESCRIPTION OF CHARGES</th>
                                <th className="py-1 px-2 text-center w-14 border-x border-[#082645]/20">QTY</th>
                                <th className="py-1 px-2 text-center w-24 border-r border-[#082645]/20">UNIT PRICE</th>
                                <th className="py-1 px-2 text-center w-20 border-r border-[#082645]/20">CURRENCY</th>
                                <th className="py-1 px-3 text-right w-30">TOTAL AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {invoice.items?.map((item, index) => (
                                <tr key={item.id} className="leading-tight hover:bg-[#f8fafc]/50 transition-colors border-b border-[#f1f5f9]">
                                    <td className="py-0.5 px-2 text-[#94a3b8] text-center font-bold border-r border-[#f1f5f9] tabular-nums text-[6.5pt]">{index + 1}</td>
                                    <td className="py-0.5 px-3 font-bold uppercase text-[#082645] text-[6.8pt] tracking-tight leading-snug">{item.description}</td>
                                    <td className="py-0.5 px-2 text-center text-[#475569] font-semibold border-r border-[#f1f5f9] tabular-nums text-[6.8pt]">{item.quantity}</td>
                                    <td className="py-0.5 px-2 text-center text-[#475569] font-semibold border-r border-[#f1f5f9] tabular-nums text-[6.8pt]">{formatAmount(item.unit_price)}</td>
                                    <td className="py-0.5 px-2 text-center text-[#64748b] font-bold border-r border-[#f1f5f9] uppercase text-[5.5pt] tracking-tighter">{item.currency || invoice.currency}</td>
                                    <td className="py-0.5 px-3 text-right font-bold text-[#082645] text-[7pt] tabular-nums">
                                        {formatAmount(item.total_price)}
                                    </td>
                                </tr>
                            ))}
                            {/* Filling empty space if items are few - reduced to 2 max */}
                            {Array.from({ length: Math.max(0, 2 - (invoice.items?.length || 0)) }).map((_, i) => (
                                <tr key={`empty-${i}`} className="h-4">
                                    <td className="border-r border-[#f1f5f9]"></td>
                                    <td></td>
                                    <td className="border-r border-[#f1f5f9]"></td>
                                    <td className="border-r border-[#f1f5f9]"></td>
                                    <td className="border-r border-[#f1f5f9]"></td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-[#f8fafc]/50">
                            <tr className="bg-[#082645] text-[#ffffff]">
                                <td colSpan={4} className="p-1.5 italic text-[6pt] uppercase font-bold tracking-tight">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#94a3b8] uppercase text-[5.2pt] font-black tracking-widest">Amount in words:</span>
                                        <span className="text-white">{invoice.currency} {numberToWords(invoice.total_amount)}</span>
                                    </div>
                                </td>
                                <td className="p-1 border-x border-white/10 text-[6pt] font-black uppercase text-center tracking-widest">GRAND TOTAL</td>
                                <td className="p-1 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[5pt] text-[#94a3b8] font-black tracking-tighter uppercase">{invoice.currency}</span>
                                        <span className="text-[9pt] font-black tracking-wider leading-none">
                                            {formatAmount(invoice.total_amount)}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Final Totals area (As per user's prompt requirement for dual totals potentially) */}
                {/* <div className="mb-10 flex justify-end">
                <div className="w-1/2 space-y-1 text-right">
                    <p className="font-bold border-b border-dotted border-[#94a3b8] pb-1">TOTAL USD: ___________________</p>
                    <p className="font-bold">TOTAL SGD: ___________________</p>
                </div>
            </div> */}

                {/* Signature & Footer Section - Strictly fixed to bottom */}
                <div className="[break-inside:avoid] mt-auto border-t border-[#f1f5f9] pt-4">
                    <div className="flex justify-between items-end mb-4 gap-4 px-1">
                        <div className="flex-1 max-w-[65%]">
                            <label className="text-[5.5pt] font-black text-[#94a3b8] uppercase tracking-widest block mb-0.5">NOTES / PAYMENT TERMS</label>
                            <p className="text-[6.2pt] leading-tight text-[#475569] whitespace-pre-line italic font-medium">
                                {invoice.notes || "1. All payments subject to agreed terms and conditions.\n2. Please quote Invoice Number as reference for all bank transfers."}
                            </p>
                        </div>
                        <div className="w-56 text-center">
                            <p className="font-black uppercase text-[6pt] text-[#082645] mb-1.5 tracking-widest underline underline-offset-3 decoration-1">Authorized Person</p>
                            <div className="space-y-0">
                                <p className="font-black text-[8pt] text-[#082645]">M.D.Mohamed Nawas</p>
                                <p className="text-[6pt] font-bold text-[#64748b] uppercase tracking-wide">Logistics Manager</p>
                            </div>
                        </div>
                    </div>

                    {/* Thank You Message */}
                    <div className="mb-2 text-center">
                        <p className="font-black italic uppercase tracking-widest text-[#082645] text-[6.5pt]">
                            Thank you for choosing Deal Universal Services PTE LTD
                        </p>
                    </div>

                    {/* Footer Disclaimer */}
                    <div className="pt-2 border-t border-[#f1f5f9] text-center">
                        <p className="text-[6pt] font-bold text-[#94a3b8] uppercase tracking-[2px]">
                            This is a computer generated invoice, no signature required.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
