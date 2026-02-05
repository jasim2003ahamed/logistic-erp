'use client';

import { useState } from 'react';
import { Package, AlertTriangle, Plus, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStock } from '../hooks/useStock';
import { ProductWithStock } from '../types';
import { StockAdjustmentModal } from './stock-adjustment-modal';

export function StockList() {
    const { data: stocks, isLoading, error } = useStock();
    const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) return <div className="p-8 text-center">Loading stock data...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading stock.</div>;

    const handleAdjustStock = (product: ProductWithStock) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Stock Management</h1>
                <div className="flex gap-2">
                    {/* Add Product button could go here or on products page */}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Inventory Levels
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-slate-100/50">
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Product</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">SKU</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Current Stock</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Min Level</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {stocks?.map((product) => {
                                    const currentStock = product.stock?.quantity || 0;
                                    const isLowStock = currentStock <= product.min_stock_level;

                                    return (
                                        <tr key={product.id} className="border-b transition-colors hover:bg-slate-100/50">
                                            <td className="p-4 align-middle font-medium">{product.name}</td>
                                            <td className="p-4 align-middle text-slate-500">{product.sku || '-'}</td>
                                            <td className="p-4 align-middle font-bold">
                                                {currentStock}
                                            </td>
                                            <td className="p-4 align-middle text-slate-500">
                                                {product.min_stock_level}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {isLowStock ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                                                        In Stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAdjustStock(product)}
                                                >
                                                    <Plus className="mr-1 h-3 w-3" /> Adjust
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {stocks?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No products found. Add products to manage stock.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {isModalOpen && selectedProduct && (
                <StockAdjustmentModal
                    product={selectedProduct}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
