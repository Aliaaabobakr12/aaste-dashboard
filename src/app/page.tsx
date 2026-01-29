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
        <p className="text-base text-muted-foreground/80 font-normal max-w-2xl">
          Aspect-Sentiment-Triplet Extraction for Arabic Product Reviews
        </p>
      </div>

      <div className="shrink-0 grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-l-4 border-l-chart-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processed Products</CardTitle>
            <Package className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for analysis</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-chart-1 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Analyzed Reviews</CardTitle>
            <Binary className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalReviews}</div>
            <p className="text-xs text-muted-foreground mt-1">Total sentences processed</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-chart-3 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Analysis</CardTitle>
            <Upload className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 text-foreground">
              <Button asChild variant="default" size="sm" className="w-full bg-chart-3 hover:bg-chart-3/90 text-white">
                <Link href="/upload">
                  Start Upload <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 min-h-0 grid md:grid-cols-2 gap-6 pb-2">
        <Card className="flex flex-col h-full overflow-hidden bg-card/40 backdrop-blur-sm border-muted/20 hover:border-muted/40 transition-colors">
          <CardHeader className="shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Binary className="h-5 w-5 text-primary" />
              How it works
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {[
                { title: "Upload JSON", desc: "Upload a file with product reviews", step: 1 },
                { title: "AI Processing", desc: "ASTE model analyzes text", step: 2 },
                { title: "Extraction", desc: "Aspects & sentiments extracted", step: 3 },
                { title: "Insights", desc: "View detailed visualizations", step: 4 }
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 p-3 rounded-lg bg-background/40 border border-muted/10 hover:border-primary/20 transition-all">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full overflow-hidden bg-card/40 backdrop-blur-sm border-muted/20 hover:border-muted/40 transition-colors">
          <CardHeader className="shrink-0">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-chart-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {products && products.length > 0 ? (
              <div className="space-y-2">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 border border-transparent hover:border-muted/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-chart-1/20 flex items-center justify-center text-chart-1">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.review_count} reviews</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-primary" asChild>
                      <Link href={`/products/${encodeURIComponent(product.name)}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                <Package className="h-8 w-8 opacity-20" />
                <span className="text-sm">No products processed yet.</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
