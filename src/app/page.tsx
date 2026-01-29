'use client';
// Force Vercel rebuild

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Package, BarChart3, Binary, ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function Home() {
  const { data: products } = useProducts();

  const totalReviews = products?.reduce((sum, p) => sum + p.review_count, 0) || 0;
  const totalProducts = products?.length || 0;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="shrink-0">
        <h1 className="text-4xl font-bold tracking-tight mb-2">ASTE Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Aspect-Sentiment-Triplet Extraction for Arabic Product Reviews
        </p>
      </div>

      <div className="shrink-0 grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Processed Products</CardTitle>
            <Package className="h-4 w-4 text-emerald-100" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
            <p className="text-xs text-emerald-100 mt-1">Ready for analysis</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Analyzed Reviews</CardTitle>
            <Binary className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalReviews}</div>
            <p className="text-xs text-blue-100 mt-1">Total sentences processed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">New Analysis</CardTitle>
            <Upload className="h-4 w-4 text-purple-100" />
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <Button asChild variant="secondary" size="sm" className="w-full">
                <Link href="/upload">
                  Start Upload <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 min-h-0 grid md:grid-cols-2 gap-6 pb-2">
        <Card className="flex flex-col h-full overflow-hidden">
          <CardHeader className="shrink-0">
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload a JSON file containing product reviews</li>
              <li>System processes text using ASTE model (Mock)</li>
              <li>Aspects, opinions, and sentiments are extracted</li>
              <li>Explore detailed analytics and visualizations</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full overflow-hidden">
          <CardHeader className="shrink-0">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {products && products.length > 0 ? (
              <div className="space-y-4">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.review_count} reviews</p>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/products/${encodeURIComponent(product.name)}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">No products processed yet.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
