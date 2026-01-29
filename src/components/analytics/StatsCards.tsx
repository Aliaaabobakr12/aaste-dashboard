import { ProductAnalytics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardsProps {
    analytics: ProductAnalytics;
}

export function StatsCards({ analytics }: StatsCardsProps) {
    const { total_reviews, avg_rating, sentiment_distribution } = analytics;
    const { positive, negative, total } = sentiment_distribution;

    // Simple NPS-like score: %Pos - %Neg
    const netScore = total > 0 ? Math.round(((positive - negative) / total) * 100) : 0;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-card/50 backdrop-blur-sm border-muted/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                    <MessageSquare className="h-4 w-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{total_reviews}</div>
                    <p className="text-xs text-muted-foreground">Processed reviews</p>
                </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-muted/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <Star className="h-4 w-4 text-chart-4 fill-chart-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avg_rating.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">Out of 5.0</p>
                </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-muted/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Sentiment Score</CardTitle>
                    {netScore >= 0 ?
                        <TrendingUp className="h-4 w-4 text-chart-2" /> :
                        <TrendingDown className="h-4 w-4 text-destructive" />
                    }
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold", netScore >= 0 ? "text-chart-2" : "text-destructive")}>
                        {netScore > 0 ? '+' : ''}{netScore}
                    </div>
                    <p className="text-xs text-muted-foreground">% Positive - % Negative</p>
                </CardContent>
            </Card>
        </div>
    );
}
// Helper for conditional class
import { cn } from '@/lib/utils';
