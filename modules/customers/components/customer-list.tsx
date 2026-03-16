'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { customerService } from '../services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CustomerForm } from './customer-form';
import { toast } from 'sonner';
import { Customer } from '../types';

export function CustomerList() {
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: customers, isLoading, error } = useQuery({
        queryKey: ['customers'],
        queryFn: () => customerService.getCustomers(),
    });

    const filteredCustomers = customers?.filter(customer =>
        customer.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.attend_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.company_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const deleteMutation = useMutation({
        mutationFn: (id: string) => customerService.deleteCustomer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer deleted successfully');
            setDeletingCustomer(null);
        },
        onError: (error: any) => {
            toast.error(`Error: ${error.message || 'Failed to delete customer'}`);
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Customers</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Customer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Customer</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new customer below.
                            </DialogDescription>
                        </DialogHeader>
                        <CustomerForm
                            onSuccess={() => setIsCreateOpen(false)}
                            onCancel={() => setIsCreateOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Customer</DialogTitle>
                        <DialogDescription>
                            Update the customer's information.
                        </DialogDescription>
                    </DialogHeader>
                    {editingCustomer && (
                        <CustomerForm
                            initialData={editingCustomer}
                            onSuccess={() => setEditingCustomer(null)}
                            onCancel={() => setEditingCustomer(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingCustomer} onOpenChange={(open: boolean) => !open && setDeletingCustomer(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the customer
                            {deletingCustomer && <span className="font-semibold"> {deletingCustomer.company_name}</span>} and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingCustomer && deleteMutation.mutate(deletingCustomer.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Customer Directory</CardTitle>
                    <div className="relative w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search customers..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="py-10 text-center">Loading customers...</div>
                    ) : error ? (
                        <div className="py-10 text-center text-red-500">
                            <p className="font-bold">Error loading customers</p>
                            <p className="text-sm">{(error as any)?.message || 'Please ensure you have run the SQL migration in Supabase and refreshed the API cache.'}</p>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100">
                                        <th className="h-12 px-4 align-middle font-medium text-slate-500">Company Name</th>
                                        <th className="h-12 px-4 align-middle font-medium text-slate-500">Company Email</th>
                                        <th className="h-12 px-4 align-middle font-medium text-slate-500">Attend Name</th>
                                        <th className="h-12 px-4 align-middle font-medium text-slate-500">Phone</th>
                                        <th className="h-12 px-4 align-middle font-medium text-slate-500">Address</th>
                                        <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredCustomers?.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="border-b transition-colors hover:bg-slate-100/50"
                                        >
                                            <td className="p-4 align-middle font-medium">{customer.company_name}</td>
                                            <td className="p-4 align-middle">{customer.company_email || 'N/A'}</td>
                                            <td className="p-4 align-middle">{customer.attend_name || 'N/A'}</td>
                                            <td className="p-4 align-middle">{customer.phone || 'N/A'}</td>
                                            <td className="p-4 align-middle">{customer.address || 'N/A'}</td>
                                            <td className="p-4 align-middle text-right space-x-2">
                                                {/* <Button variant="ghost" size="sm" asChild title="View Details">
                                                    <Link href={`/customers/${customer.id}`}>View</Link>
                                                </Button> */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditingCustomer(customer)}
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    title="Edit Customer"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeletingCustomer(customer)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    title="Delete Customer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCustomers?.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-slate-500">
                                                No customers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

