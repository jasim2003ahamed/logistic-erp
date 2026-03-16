'use client';

import React from 'react';
import { PendingInvoice, Payment } from '../types';

interface CollectionNoteTemplateProps {
    data: PendingInvoice | Payment | null;
    type: 'invoice' | 'payment' | 'manual';
    collectionData?: {
        collection_note_no?: string;
        date?: string;
        shipper_company_name?: string;
        shipper_address?: string;
        shipper_contact_person?: string;
        shipper_contact_no?: string;
        consignee_company_name?: string;
        consignee_address?: string;
        consignee_contact_person?: string;
        consignee_contact_no?: string;
        total_packages?: string;
        total_weight?: string;
        total_volume?: string;
        vehicle_no?: string;
        driver_name?: string;
        driver_contact?: string;
        collection_time?: string;
        delivery_time?: string;
        remarks?: string;
        driver_name_sig?: string;
        driver_sig_date?: string;
        customer_name_sig?: string;
        customer_sig_date?: string;
    };
}

export const CollectionNoteTemplate = React.forwardRef<HTMLDivElement, CollectionNoteTemplateProps>(
    ({ data, type, collectionData }, ref) => {
        const isInvoice = type === 'invoice';
        const isPayment = type === 'payment';
        const invoice = isInvoice ? (data as PendingInvoice) : (isPayment ? (data as Payment)?.invoice : null);
        const customer = invoice?.customer as any;

        const formatDate = (dateStr: string | undefined | null) => {
            if (!dateStr) return "________________________________";
            return new Date(dateStr).toLocaleDateString('en-SG', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).toUpperCase();
        };

        return (
            <div ref={ref} className="bg-white p-8 md:p-12 text-[12px] leading-relaxed text-black max-w-[210mm] mx-auto shadow-none print:p-0" id="collection-note-template">
                {/* Header */}
                <div className="text-left mb-8 space-y-1">
                    <h1 className="text-xl font-bold underline mb-4 text-center">LOCAL COLLECTION NOTE</h1>
                    <p><span className="font-bold">Company Name:</span> Deal Universal Services Pte Ltd</p>
                    <p><span className="font-bold">Address:</span> 715 CLEMENTI WEST STREET 2, #05-69, VISTA 18, SINGAPORE 120715</p>
                    <p><span className="font-bold">Tel:</span> +65 8332 1063, +65 9893 3211</p>
                    <p><span className="font-bold">Email:</span> info@dealuniversal.com</p>
                    <p><span className="font-bold">UEN:</span> 202550289G</p>
                </div>

                {/* Collection Details */}
                <div className="mb-6">
                    <h2 className="font-bold underline mb-2">Collection Details</h2>
                    <p><span className="font-bold">Collection Note No:</span> {collectionData?.collection_note_no || "__________________"}</p>
                    <p><span className="font-bold">Date:</span> {collectionData?.date || formatDate(isInvoice ? new Date().toISOString() : (isPayment ? (data as Payment)?.payment_date : new Date().toISOString()))}</p>
                </div>

                {/* Shipper / Consignee Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-1">
                        <h2 className="font-bold underline mb-2">Shipper / Collection From:</h2>
                        <p><span className="font-bold">Company Name:</span> {collectionData?.shipper_company_name || "__________________________"}</p>
                        <p><span className="font-bold">Address:</span> {collectionData?.shipper_address || "________________________________"}</p>
                        <p><span className="font-bold">Contact Person:</span> {collectionData?.shipper_contact_person || "________________________"}</p>
                        <p><span className="font-bold">Contact No:</span> {collectionData?.shipper_contact_no || "_____________________________"}</p>
                    </div>
                    <div className="space-y-1">
                        <h2 className="font-bold underline mb-2">Consignee / Deliver To:</h2>
                        <p><span className="font-bold">Company Name:</span> {collectionData?.consignee_company_name || customer?.company_name || "__________________________"}</p>
                        <p><span className="font-bold">Address:</span> {collectionData?.consignee_address || customer?.address || "________________________________"}</p>
                        <p><span className="font-bold">Contact Person:</span> {collectionData?.consignee_contact_person || customer?.attend_name || "________________________"}</p>
                        <p><span className="font-bold">Contact No:</span> {collectionData?.consignee_contact_no || customer?.phone || "_____________________________"}</p>
                    </div>
                </div>

                {/* Cargo Details */}
                <div className="mb-8">
                    <h2 className="font-bold underline mb-2">Cargo Details</h2>
                    <table className="w-full border-collapse border border-black">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border border-black p-2 text-left">Description of Goods</th>
                                <th className="border border-black p-2 text-center w-20">Qty</th>
                                <th className="border border-black p-2 text-center w-24">Packaging</th>
                                <th className="border border-black p-2 text-center w-24">Weight (kg)</th>
                                <th className="border border-black p-2 text-center w-24">CBM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice?.items?.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="border border-black p-2">{item.description}</td>
                                    <td className="border border-black p-2 text-center">{item.quantity}</td>
                                    <td className="border border-black p-2 text-center">________________</td>
                                    <td className="border border-black p-2 text-center">________________</td>
                                    <td className="border border-black p-2 text-center">________________</td>
                                </tr>
                            )) || (
                                    <tr>
                                        <td className="border border-black p-2 h-10"></td>
                                        <td className="border border-black p-2 h-10"></td>
                                        <td className="border border-black p-2 h-10"></td>
                                        <td className="border border-black p-2 h-10"></td>
                                        <td className="border border-black p-2 h-10"></td>
                                    </tr>
                                )}
                            {[...Array(Math.max(0, 3 - (invoice?.items?.length || 0)))].map((_, i) => (
                                <tr key={`empty-${i}`}>
                                    <td className="border border-black p-2 h-10"></td>
                                    <td className="border border-black p-2 h-10"></td>
                                    <td className="border border-black p-2 h-10"></td>
                                    <td className="border border-black p-2 h-10"></td>
                                    <td className="border border-black p-2 h-10"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mb-8 space-y-1">
                    <p><span className="font-bold">Total Packages:</span> {collectionData?.total_packages || "__________"}</p>
                    <p><span className="font-bold">Total Weight:</span> {collectionData?.total_weight || "__________"} kg</p>
                    <p><span className="font-bold">Total Volume:</span> {collectionData?.total_volume || "__________"} CBM</p>
                </div>

                {/* Transport Details */}
                <div className="mb-8 p-4 border border-black rounded-sm">
                    <h2 className="font-bold underline mb-2">Transport Details</h2>
                    <div className="grid grid-cols-2 gap-y-2">
                        <p><span className="font-bold">Vehicle No:</span> {collectionData?.vehicle_no || "_____________________________"}</p>
                        <p><span className="font-bold">Driver Name:</span> {collectionData?.driver_name || "____________________________"}</p>
                        <p><span className="font-bold">Driver Contact:</span> {collectionData?.driver_contact || "_________________________"}</p>
                        <p><span className="font-bold">Collection Time:</span> {collectionData?.collection_time || "________________________"}</p>
                        <p><span className="font-bold">Delivery Time:</span> {collectionData?.delivery_time || "__________________________"}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="font-bold underline mb-1">Remarks</h2>
                    <div className="min-h-12 border-b border-black">
                        {collectionData?.remarks || ""}
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="font-bold underline mb-1">Declaration</h2>
                    <p>Goods received in good order and condition unless otherwise stated.</p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-20">
                    <div className="space-y-6">
                        <p className="font-bold">Collected By (Driver):</p>
                        <div className="space-y-4">
                            <p>Name: {collectionData?.driver_name_sig || "__________________"}</p>
                            <p>Signature: _____________</p>
                            <p>Date: {collectionData?.driver_sig_date || "__________________"}</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <p className="font-bold">Received By (Customer):</p>
                        <div className="space-y-4">
                            <p>Name: {collectionData?.customer_name_sig || "__________________"}</p>
                            <p>Company Stamp & Signature: _______________</p>
                            <p>Date: {collectionData?.customer_sig_date || "__________________"}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

CollectionNoteTemplate.displayName = 'CollectionNoteTemplate';
