import { NextResponse } from 'next/server';
import { listProcessedFiles, getProcessedFile } from '@/lib/storage';
import { groupReviewsByProduct, aggregateProductStats } from '@/lib/analyticsCalculator';
import { Product, ProcessedReview } from '@/types';

export const dynamic = 'force-dynamic'; // Ensure no caching for this demo

export async function GET() {
    try {
        const files = await listProcessedFiles();
        let allReviews: ProcessedReview[] = [];

        // Load sample data if no files processed yet (for demo purposes)
        if (files.length > 0) {
            for (const file of files) {
                // jobId is filename without ext
                const jobId = file.replace('.json', '');
                const reviews = await getProcessedFile(jobId);
                allReviews.push(...reviews);
            }
        }

        const grouped = groupReviewsByProduct(allReviews);
        const products: Product[] = Object.entries(grouped).map(([name, reviews]) => aggregateProductStats(reviews, name));

        return NextResponse.json(products);

    } catch (error) {
        console.error('Products error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
