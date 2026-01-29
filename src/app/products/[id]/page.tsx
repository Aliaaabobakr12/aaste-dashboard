'use client';

import { useProductAnalytics } from '@/hooks/useProductAnalytics';
import { useReviews } from '@/hooks/useReviews';
import { StatsCards } from '@/components/analytics/StatsCards';
import { SentimentPieChart } from '@/components/analytics/SentimentPieChart';
import { AspectBarChart } from '@/components/analytics/AspectBarChart';
import { SentimentByAspect } from '@/components/analytics/SentimentByAspect';
import { ReviewsTable } from '@/components/reviews/ReviewsTable';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

import { use } from 'react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // This is encoded name
    const { data: analytics, isLoading: isAnalyticsLoading } = useProductAnalytics(id);
    const { data: reviews, isLoading: isReviewsLoading } = useReviews(id);

    const isLoading = isAnalyticsLoading || isReviewsLoading;

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!analytics || !reviews) {
        return <div>Product not found</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/products" className="text-sm text-muted-foreground flex items-center hover:text-primary transition-colors w-fit">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">{analytics.product_name}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{reviews[0]?.category}</Badge>
                            <span className="text-sm text-muted-foreground">ID: {decodeURIComponent(id)}</span>
                        </div>
                    </div>
                    {reviews[0]?.product_link && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={reviews[0].product_link} target="_blank" rel="noopener noreferrer">
                                Product Page <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    )}
                </div>
            </div>

            <StatsCards analytics={analytics} />

            <Separator />

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <SentimentPieChart analytics={analytics} />
                <AspectBarChart analytics={analytics} />
                <div className="md:col-span-2">
                    <SentimentByAspect analytics={analytics} />
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Reviews Analysis</h2>
                <ReviewsTable data={reviews} />
            </div>
        </div>
    );
}
