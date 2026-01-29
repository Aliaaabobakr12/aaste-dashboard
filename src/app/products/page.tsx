'use client';

import { useProducts } from '@/hooks/useProducts';
import { ProductsTable } from '@/components/products/ProductsTable';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductsPage() {
    const { data: products, isLoading, error } = useProducts();

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Products</h1>
                <p className="text-sm text-muted-foreground/80">
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
                <Card className="bg-transparent border-none shadow-none">
                    <CardContent className="p-0">
                        <ProductsTable data={products || []} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
