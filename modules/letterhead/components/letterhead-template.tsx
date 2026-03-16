'use client';

import { Mail, Phone, Globe, MapPin } from 'lucide-react';

export function LetterheadTemplate() {
    return (
        <div className="w-[210mm] min-h-[297mm] bg-white relative overflow-hidden flex flex-col shadow-xl print:shadow-none font-sans" id="letterhead-template">
            {/* Top Right Blue Accent - Precision Trapezoid */}
            <div className="absolute top-0 right-0 w-[45%] h-14 bg-[#1e40af]" style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>

            {/* Header Section */}
            <div className="pt-8 px-10 relative z-10 flex justify-between items-start">
                {/* Left Side: Logo & Company ID (Centered column) */}
                <div className="flex flex-col items-center">
                    <img
                        src="/logo.png"
                        alt="Deal Universal Services Logo"
                        className="h-28 w-auto object-contain mb-2"
                    />
                    <div className="text-center">
                        <p className="font-bold text-[11px] text-[#1e293b]">UEN: 202550289G</p>
                        <p className="text-[10px] text-[#475569] font-bold leading-tight mt-0.5">
                            Freight Transport Arrangement | Ship Chandlers
                        </p>
                    </div>
                </div>

                {/* Right Side: Contact Details (Icon on left) */}
                <div className="pt-6 space-y-2.5 flex flex-col items-start pr-4">
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#1e293b]" strokeWidth={2.5} />
                        <span className="text-[10px] font-bold text-[#1e293b]">info@dealuniversal.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#1e293b]" strokeWidth={2.5} />
                        <span className="text-[10px] font-bold text-[#1e293b]">98933211</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-[#1e293b]" strokeWidth={2.5} />
                        <span className="text-[10px] font-bold text-[#1e293b]">dealuniversal.com</span>
                    </div>
                    <div className="flex items-start gap-3 max-w-[200px]">
                        <MapPin className="w-4 h-4 text-[#1e293b] mt-0.5" strokeWidth={2.5} />
                        <span className="text-[9px] font-bold leading-relaxed text-[#1e293b] uppercase">
                            715 CLEMENTI WEST STREET 2, #05-69,<br />
                            VISTA 18, SINGAPORE 120715
                        </span>
                    </div>
                </div>
            </div>

            {/* Separator Line */}
            <div className="mt-4 mx-8 border-b-2 border-[#1e293b]"></div>

            {/* Watermark Section */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <img
                    src="/logo.png"
                    alt="Watermark"
                    className="w-[500px] opacity-[0.05] grayscale"
                />
            </div>

            {/* Main Content Area (Spacer) */}
            <div className="flex-grow pt-10 px-16 relative z-10">
                {/* Letter Body Area */}
            </div>

            {/* Footer Section */}
            <div className="relative mt-auto">
                {/* Horizontal Bottom Bar */}
                <div className="w-full h-8 bg-[#1e40af]"></div>

                {/* Bottom Left Design Elements (Triangles from Image) */}
                <div className="absolute bottom-0 left-0 w-64 h-24 overflow-hidden pointer-events-none">
                    {/* Purple-ish triangle */}
                    <div className="absolute bottom-0 left-0 w-[40%] h-[70%] bg-[#7c3aed] transform -skew-x-[35deg] origin-bottom-left -translate-x-12"></div>
                    {/* Light blue triangle */}
                    <div className="absolute bottom-0 left-0 w-[60%] h-[55%] bg-[#3b82f6] transform -skew-x-[35deg] origin-bottom-left -translate-x-6"></div>
                    {/* Dark blue triangle */}
                    <div className="absolute bottom-0 left-0 w-[80%] h-[40%] bg-[#1e3a8a] transform -skew-x-[35deg] origin-bottom-left -translate-x-2"></div>
                </div>
            </div>

            <style jsx>{`
                @media print {
                    #letterhead-template {
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
        </div>
    );
}
