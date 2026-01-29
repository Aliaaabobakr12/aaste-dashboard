'use client';

import { useProducts } from '@/hooks/useProducts';
import { ProductsTable } from '@/components/products/ProductsTable';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

export default function ProductsPage() {
    const { data: products, isLoading, error } = useProducts();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">
                    View sentiment analysis results for processed products.
                </p>
            </div>

            <Separator />

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-red-500">Failed to load products.</div>
            ) : (
                <ProductsTable data={products || []} />
            )}
        </div>
    );
}
