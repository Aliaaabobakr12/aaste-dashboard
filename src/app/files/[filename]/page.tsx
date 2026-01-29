'use client';

import { use, useEffect, useState } from 'react';
import { StatsCards } from '@/components/analytics/StatsCards';
import { SentimentPieChart } from '@/components/analytics/SentimentPieChart';
import { AspectBarChart } from '@/components/analytics/AspectBarChart';
import { SentimentByAspect } from '@/components/analytics/SentimentByAspect';
import { ReviewsTable } from '@/components/reviews/ReviewsTable';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProductAnalytics, ProcessedReview } from '@/types';
import { toast } from 'sonner';

export default function FileAnalysisPage({ params }: { params: Promise<{ filename: string }> }) {
    const { filename } = use(params);
    const decodedFilename = decodeURIComponent(filename);

    const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);
    const [reviews, setReviews] = useState<ProcessedReview[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch analytics
                const analyticsRes = await fetch(`/api/files/${decodedFilename}/analytics`);
                if (!analyticsRes.ok) throw new Error('Failed to fetch analytics');
                const analyticsData = await analyticsRes.json();
                setAnalytics(analyticsData);

                // Fetch reviews
                const reviewsRes = await fetch(`/api/files/${decodedFilename}/reviews`);
                if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);

            } catch (error) {
                console.error('Error fetching file data:', error);
                toast.error('Failed to load file analysis');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [decodedFilename]);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!analytics || !reviews) {
        return <div>File not found</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/files" className="text-sm text-muted-foreground flex items-center hover:text-emerald-500 transition-colors w-fit">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Files
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">File Analysis</h1>
                        <p className="text-muted-foreground mt-1">{decodedFilename}</p>
                    </div>
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
                <h2 className="text-2xl font-semibold tracking-tight">All Reviews in File</h2>
                <ReviewsTable data={reviews} />
            </div>
        </div>
    );
}
