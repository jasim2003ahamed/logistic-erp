'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { recordPaymentSchema, RecordPaymentFormValues, PendingInvoice } from '../types';
import { useRecordPayment } from '../hooks/useCollections';

interface PaymentModalProps {
    invoice: PendingInvoice | null;
    onClose: () => void;
}

export function PaymentModal({ invoice, onClose }: PaymentModalProps) {
    const recordPayment = useRecordPayment();

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RecordPaymentFormValues>({
        resolver: zodResolver(recordPaymentSchema) as any,
        defaultValues: {
            invoice_id: invoice?.id || '',
            amount: invoice?.balance_amount || 0,
            payment_mode: 'cash',
            payment_date: new Date().toISOString().split('T')[0],
            notes: '',
        } as any,
    });

    const onSubmit = async (data: RecordPaymentFormValues) => {
        try {
            await recordPayment.mutateAsync(data);
            onClose();
        } catch (error) {
            console.error('Failed to record payment:', error);
            alert('Failed to record payment');
        }
    };

    return (
        <Dialog open={!!invoice} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Record Payment for #{invoice?.invoice_number}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Outstanding Balance</Label>
                        <div className="text-2xl font-bold text-slate-900">
                            ₹ {invoice?.balance_amount.toFixed(2)}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Payment Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            {...register('amount')}
                        />
                        {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mode">Payment Mode</Label>
                        <Select
                            onValueChange={(value) => setValue('payment_mode', value as any)}
                            defaultValue="cash"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="upi">UPI</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ref">Reference # (Optional)</Label>
                        <Input
                            id="ref"
                            {...register('reference_number')}
                            placeholder="UPI Transaction ID, Check #, etc."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Payment Date</Label>
                        <Input
                            id="date"
                            type="date"
                            {...register('payment_date')}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Recording...' : 'Record Payment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
