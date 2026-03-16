'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useReactToPrint } from 'react-to-print';
import { CollectionNoteTemplate } from './collection-note-template';
import { PendingInvoice, Payment } from '../types';
import { Printer, X } from 'lucide-react';

interface CollectionNoteModalProps {
    data: PendingInvoice | Payment | null;
    type: 'invoice' | 'payment' | 'manual';
    isOpen: boolean;
    onClose: () => void;
}

export function CollectionNoteModal({ data, type, isOpen, onClose }: CollectionNoteModalProps) {
    const [collectionData, setCollectionData] = useState({
        collection_note_no: '',
        date: new Date().toISOString().split('T')[0],
        shipper_company_name: '',
        shipper_address: '',
        shipper_contact_person: '',
        shipper_contact_no: '',
        consignee_company_name: (data as any)?.customer?.company_name || '',
        consignee_address: (data as any)?.customer?.address || '',
        consignee_contact_person: (data as any)?.customer?.attend_name || '',
        consignee_contact_no: (data as any)?.customer?.phone || '',
        total_packages: '',
        total_weight: '',
        total_volume: '',
        vehicle_no: '',
        driver_name: '',
        driver_contact: '',
        collection_time: '',
        delivery_time: '',
        remarks: '',
        driver_name_sig: '',
        driver_sig_date: new Date().toISOString().split('T')[0],
        customer_name_sig: (data as any)?.customer?.attend_name || '',
        customer_sig_date: new Date().toISOString().split('T')[0],
    });

    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Collection-Note-${(data as any)?.invoice_number || (data as any)?.invoice?.invoice_number || 'Manual'}`,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCollectionData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Generate Local Collection Note</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Collection Details */}
                    <div className="space-y-4 border p-4 rounded-lg bg-slate-50">
                        <h3 className="font-semibold border-b pb-2">Collection details</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="collection_note_no">Collection Note No</Label>
                            <Input id="collection_note_no" name="collection_note_no" value={collectionData.collection_note_no} onChange={handleChange} placeholder="e.g. CN-001" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" name="date" type="date" value={collectionData.date} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Shipper Details */}
                    <div className="space-y-4 border p-4 rounded-lg">
                        <h3 className="font-semibold border-b pb-2">Shipper / Collection From</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="shipper_company_name">Company Name</Label>
                            <Input id="shipper_company_name" name="shipper_company_name" value={collectionData.shipper_company_name} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="shipper_address">Address</Label>
                            <Input id="shipper_address" name="shipper_address" value={collectionData.shipper_address} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="shipper_contact_person">Contact Person</Label>
                                <Input id="shipper_contact_person" name="shipper_contact_person" value={collectionData.shipper_contact_person} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="shipper_contact_no">Contact No</Label>
                                <Input id="shipper_contact_no" name="shipper_contact_no" value={collectionData.shipper_contact_no} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Consignee Details */}
                    <div className="space-y-4 border p-4 rounded-lg bg-slate-50">
                        <h3 className="font-semibold border-b pb-2">Consignee / Deliver To</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="consignee_company_name">Company Name</Label>
                            <Input id="consignee_company_name" name="consignee_company_name" value={collectionData.consignee_company_name} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="consignee_address">Address</Label>
                            <Input id="consignee_address" name="consignee_address" value={collectionData.consignee_address} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="consignee_contact_person">Contact Person</Label>
                                <Input id="consignee_contact_person" name="consignee_contact_person" value={collectionData.consignee_contact_person} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="consignee_contact_no">Contact No</Label>
                                <Input id="consignee_contact_no" name="consignee_contact_no" value={collectionData.consignee_contact_no} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Cargo Totals */}
                    <div className="space-y-4 border p-4 rounded-lg">
                        <h3 className="font-semibold border-b pb-2">Cargo Summary</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="total_packages">Total Pkgs</Label>
                                <Input id="total_packages" name="total_packages" value={collectionData.total_packages} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="total_weight">Weight (kg)</Label>
                                <Input id="total_weight" name="total_weight" value={collectionData.total_weight} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="total_volume">Volume (CBM)</Label>
                                <Input id="total_volume" name="total_volume" value={collectionData.total_volume} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Transport Details */}
                    <div className="space-y-4 border p-4 rounded-lg md:col-span-2">
                        <h3 className="font-semibold border-b pb-2">Transport Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="vehicle_no">Vehicle No</Label>
                                <Input id="vehicle_no" name="vehicle_no" value={collectionData.vehicle_no} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="driver_name">Driver Name</Label>
                                <Input id="driver_name" name="driver_name" value={collectionData.driver_name} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="driver_contact">Driver Contact</Label>
                                <Input id="driver_contact" name="driver_contact" value={collectionData.driver_contact} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="collection_time">Collection Time</Label>
                                <Input id="collection_time" name="collection_time" value={collectionData.collection_time} onChange={handleChange} placeholder="e.g. 10:00 AM" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="delivery_time">Delivery Time</Label>
                                <Input id="delivery_time" name="delivery_time" value={collectionData.delivery_time} onChange={handleChange} placeholder="e.g. 02:00 PM" />
                            </div>
                        </div>
                    </div>

                    {/* Remarks and Signatures */}
                    <div className="space-y-4 border p-4 rounded-lg md:col-span-2">
                        <h3 className="font-semibold border-b pb-2">Remarks & Signatures</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="remarks">Remarks</Label>
                            <Textarea id="remarks" name="remarks" value={collectionData.remarks} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2 border-r pr-4">
                                <Label className="text-xs text-slate-500">Collected By (Driver)</Label>
                                <Input name="driver_name_sig" value={collectionData.driver_name_sig} onChange={handleChange} placeholder="Driver Name" />
                                <Input name="driver_sig_date" type="date" value={collectionData.driver_sig_date} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-slate-500">Received By (Customer)</Label>
                                <Input name="customer_name_sig" value={collectionData.customer_name_sig} onChange={handleChange} placeholder="Customer Name" />
                                <Input name="customer_sig_date" type="date" value={collectionData.customer_sig_date} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={() => handlePrint()}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print Collection Note
                    </Button>
                </DialogFooter>

                {/* Hidden Template for Printing */}
                <div className="hidden">
                    <div className="p-8"> {/* Wrapper for print margin */}
                        <CollectionNoteTemplate
                            ref={printRef}
                            data={data}
                            type={type}
                            collectionData={collectionData}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
