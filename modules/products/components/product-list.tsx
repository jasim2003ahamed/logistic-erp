'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { productService } from '../services';
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
import { ProductForm } from './product-form';
import { toast } from 'sonner';
import { Product } from '../types';

export function ProductList() {
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getProducts(),
    });

    const filteredProducts = products?.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully');
            setDeletingProduct(null);
        },
        onError: (error: any) => {
            toast.error(`Error: ${error.message || 'Failed to delete product'}`);
        },
    });

    if (isLoading) return <div>Loading products...</div>;
    if (error) return <div className="text-red-500">Error loading products</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Products</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new product SKU.
                            </DialogDescription>
                        </DialogHeader>
                        <ProductForm
                            onSuccess={() => setIsCreateOpen(false)}
                            onCancel={() => setIsCreateOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingProduct} onOpenChange={(open: boolean) => !open && setEditingProduct(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Update the product's information.
                        </DialogDescription>
                    </DialogHeader>
                    {editingProduct && (
                        <ProductForm
                            initialData={editingProduct}
                            onSuccess={() => setEditingProduct(null)}
                            onCancel={() => setEditingProduct(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product
                            {deletingProduct && <span className="font-semibold"> {deletingProduct.name}</span>} and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingProduct && deleteMutation.mutate(deletingProduct.id)}
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
                    <CardTitle>Inventory List</CardTitle>
                    <div className="relative w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search products..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100">
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Name</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">SKU</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Price</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Created At</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredProducts?.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b transition-colors hover:bg-slate-100/50"
                                    >
                                        <td className="p-4 align-middle font-medium">{product.name}</td>
                                        <td className="p-4 align-middle">{product.sku || 'N/A'}</td>
                                        <td className="p-4 align-middle text-right">${product.price ? Number(product.price).toLocaleString() : '0'}</td>
                                        <td className="p-4 align-middle">{new Date(product.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle text-right space-x-2">
                                            <Button variant="ghost" size="sm" asChild title="View Details">
                                                <Link href={`/products/${product.id}`}>View</Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingProduct(product)}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                title="Edit Product"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeletingProduct(product)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                title="Delete Product"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-slate-500">
                                            No products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
