'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, X } from 'lucide-react';
import { customerService } from '../services';
import { createCustomerSchema, CreateCustomerFormValues, Customer } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CustomerFormProps {
    initialData?: Customer;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CustomerForm({ initialData, onSuccess, onCancel }: CustomerFormProps) {
    const queryClient = useQueryClient();

    const form = useForm<CreateCustomerFormValues>({
        resolver: zodResolver(createCustomerSchema),
        defaultValues: initialData ? {
            company_name: initialData.company_name,
            company_email: initialData.company_email || '',
            attend_name: initialData.attend_name || '',
            phone: initialData.phone || '',
            address: initialData.address || '',
            uen: initialData.uen || '',
        } : {
            company_name: '',
            company_email: '',
            attend_name: '',
            phone: '',
            address: '',
            uen: '',
        },
    });

    const mutation = useMutation({
        mutationFn: (values: CreateCustomerFormValues) =>
            initialData
                ? customerService.updateCustomer(initialData.id, values)
                : customerService.createCustomer(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success(initialData ? 'Customer updated successfully' : 'Customer onboarded successfully');
            onSuccess?.();
        },
        onError: (error: any) => {
            const message = error?.message || `Failed to ${initialData ? 'update' : 'onboard'} customer`;
            toast.error(`Error: ${message}`);
        },
    });

    const onSubmit = (values: CreateCustomerFormValues) => {
        const payload = {
            ...values,
            company_email: values.company_email?.trim() || null,
            attend_name: values.attend_name?.trim() || null,
            phone: values.phone?.trim() || null,
            address: values.address?.trim() || null,
            uen: values.uen?.trim() || null,
        };
        mutation.mutate(payload);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Company Name</label>
                <Input
                    {...form.register('company_name')}
                    placeholder="Enter company name"
                    className="focus-visible:ring-slate-400"
                />
                {form.formState.errors.company_name && (
                    <p className="text-xs text-red-500">{form.formState.errors.company_name.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Company Email</label>
                    <Input
                        {...form.register('company_email')}
                        type="email"
                        placeholder="email@example.com"
                        className="focus-visible:ring-slate-400"
                    />
                    {form.formState.errors.company_email && (
                        <p className="text-xs text-red-500">{form.formState.errors.company_email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phone</label>
                    <Input
                        {...form.register('phone')}
                        placeholder="+65 0000 0000"
                        className="focus-visible:ring-slate-400"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Attend Name</label>
                    <Input
                        {...form.register('attend_name')}
                        placeholder="Contact person"
                        className="focus-visible:ring-slate-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Business UEN</label>
                    <Input
                        {...form.register('uen')}
                        placeholder="e.g. 202550289G"
                        className="focus-visible:ring-slate-400"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Address</label>
                <Textarea
                    {...form.register('address')}
                    placeholder="Enter full address"
                    className="min-h-[100px] focus-visible:ring-slate-400"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={mutation.isPending}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : initialData ? 'Update Customer' : 'Create Customer'}
                </Button>
            </div>
        </form>
    );
}

