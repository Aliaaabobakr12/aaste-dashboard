import { ProcessedReview, Product, ProductAnalytics, SentimentSummary, AspectFrequency, AspectSentiment, RatingDistribution, TimelinePoint } from '@/types';

// Helper to group reviews by product name
export function groupReviewsByProduct(reviews: ProcessedReview[]): Record<string, ProcessedReview[]> {
    const groups: Record<string, ProcessedReview[]> = {};
    reviews.forEach(r => {
        const name = r.product_name || 'Unknown Product';
        if (!groups[name]) groups[name] = [];
        groups[name].push(r);
    });
    return groups;
}

export function aggregateProductStats(reviews: ProcessedReview[], productId?: string): Product {
    if (reviews.length === 0) {
        throw new Error('No reviews to aggregate');
    }

    const first = reviews[0];
    const summary = calculateSentimentSummary(reviews);

    const totalStars = reviews.reduce((sum, r) => sum + parseFloat(r.star_rating || '0'), 0);
    const avgRating = totalStars / reviews.length;

    // Ensure we have a valid name to display
    const name = first.product_name || productId || 'Unknown Product';
    const finalId = productId || first.product_name || 'unknown';

    return {
        id: finalId,
        name: name,
        category: first.category,
        link: first.product_link,
        review_count: reviews.length,
        avg_rating: avgRating,
        sentiment_summary: summary
    };
}

export function calculateAnalytics(reviews: ProcessedReview[], productId: string): ProductAnalytics {
    const summary = calculateSentimentSummary(reviews);

    // Rating dist
    const ratingMap = new Map<number, number>();
    reviews.forEach(r => {
        const rating = Math.floor(parseFloat(r.star_rating));
        ratingMap.set(rating, (ratingMap.get(rating) || 0) + 1);
    });
    const rating_distribution: RatingDistribution[] = Array.from([1, 2, 3, 4, 5]).map(r => ({
        rating: r,
        count: ratingMap.get(r) || 0
    }));

    // Aspect frequency & sentiment
    const aspectMap = new Map<string, { pos: number, neg: number, neu: number }>();

    reviews.forEach(r => {
        r.parsed_triplets.forEach(t => {
            const aspect = t.aspect_text;
            if (!aspectMap.has(aspect)) {
                aspectMap.set(aspect, { pos: 0, neg: 0, neu: 0 });
            }
            const stats = aspectMap.get(aspect)!;
            if (t.sentiment === 'POS') stats.pos++;
            else if (t.sentiment === 'NEG') stats.neg++;
            else stats.neu++;
        });
    });

    const aspect_frequency: AspectFrequency[] = [];
    const aspect_sentiment: AspectSentiment[] = [];

    aspectMap.forEach((stats, aspect) => {
        const count = stats.pos + stats.neg + stats.neu;
        aspect_frequency.push({ aspect, count });
        aspect_sentiment.push({
            aspect,
            positive: stats.pos,
            negative: stats.neg,
            neutral: stats.neu
        });
    });

    // Sort by frequency
    aspect_frequency.sort((a, b) => b.count - a.count);
    aspect_sentiment.sort((a, b) => (b.positive + b.negative + b.neutral) - (a.positive + a.negative + a.neutral));

    // Timeline (mocking daily)
    const timelineMap = new Map<string, { pos: number, neg: number, neu: number }>();
    reviews.forEach(r => {
        const date = r.scraped_at ? r.scraped_at.split('T')[0] : 'Unknown';
        if (!timelineMap.has(date)) timelineMap.set(date, { pos: 0, neg: 0, neu: 0 });
        const stats = timelineMap.get(date)!;
        if (r.overall_sentiment === 'POS') stats.pos++;
        else if (r.overall_sentiment === 'NEG') stats.neg++;
        else stats.neu++;
    });

    const timeline: TimelinePoint[] = Array.from(timelineMap.entries()).map(([date, stats]) => ({
        date,
        positive: stats.pos,
        negative: stats.neg,
        neutral: stats.neu
    })).sort((a, b) => a.date.localeCompare(b.date));

    return {
        product_id: productId,
        product_name: reviews[0]?.product_name || 'Unknown',
        total_reviews: reviews.length,
        avg_rating: reviews.reduce((sum, r) => sum + parseFloat(r.star_rating || '0'), 0) / reviews.length,
        sentiment_distribution: summary,
        aspect_frequency: aspect_frequency.slice(0, 10), // Top 10
        aspect_sentiment: aspect_sentiment.slice(0, 10),
        rating_distribution,
        timeline
    };
}

function calculateSentimentSummary(reviews: ProcessedReview[]): SentimentSummary {
    let pos = 0, neg = 0, neu = 0;
    reviews.forEach(r => {
        if (r.overall_sentiment === 'POS') pos++;
        else if (r.overall_sentiment === 'NEG') neg++;
        else neu++;
    });
    return {
        positive: pos,
        negative: neg,
        neutral: neu,
        total: reviews.length
    };
}
