'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Truck, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createDeliveryOrderSchema, CreateDeliveryOrderFormValues } from '../types';
import { useCreateDeliveryOrder } from '../hooks/useDeliveryOrders';
import { useRouter } from 'next/navigation';

interface DeliveryOrderFormProps {
    initialValues: Partial<CreateDeliveryOrderFormValues>;
}

export function DeliveryOrderForm({ initialValues }: DeliveryOrderFormProps) {
    const createDO = useCreateDeliveryOrder();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateDeliveryOrderFormValues>({
        resolver: zodResolver(createDeliveryOrderSchema) as any,
        defaultValues: {
            ...initialValues,
            driver_name: '',
            vehicle_number: '',
            status: 'dispatched',
        } as any,
    });

    const onSubmit = async (data: CreateDeliveryOrderFormValues) => {
        try {
            await createDO.mutateAsync(data);
        } catch (error) {
            console.error('Failed to create delivery order:', error);
            alert('Failed to create delivery order');
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Dispatch Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-400" />
                                Driver Name
                            </label>
                            <Input
                                {...register('driver_name')}
                                placeholder="John Doe"
                            />
                            {errors.driver_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.driver_name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                {/* IdentificationCard is not in lucide by default, using Tag or simple text */}
                                <Truck className="h-4 w-4 text-slate-400" />
                                Vehicle Number
                            </label>
                            <Input
                                {...register('vehicle_number')}
                                placeholder="V-12345"
                            />
                            {errors.vehicle_number && (
                                <p className="text-xs text-red-500 font-medium">{errors.vehicle_number.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                Delivery Date
                            </label>
                            <Input
                                type="date"
                                {...register('delivery_date')}
                            />
                            {errors.delivery_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.delivery_date.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Notes (Optional)</label>
                        <textarea
                            {...register('notes')}
                            className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                            placeholder="Any special instructions..."
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Confirm Dispatch'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
