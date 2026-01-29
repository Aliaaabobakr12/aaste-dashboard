import { NextRequest, NextResponse } from 'next/server';
import { listProcessedFiles, getProcessedFile } from '@/lib/storage';
import { calculateAnalytics } from '@/lib/analyticsCalculator';
import { ProcessedReview } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        // Decode the ID (product name)
        const productId = decodeURIComponent(id);

        const files = await listProcessedFiles();
        let allReviews: ProcessedReview[] = [];

        if (files.length > 0) {
            for (const file of files) {
                const jobId = file.replace('.json', '');
                const reviews = await getProcessedFile(jobId);
                allReviews.push(...reviews);
            }
        }

        // Filter by product name
        const productReviews = allReviews.filter(r => r.product_name === productId);

        if (productReviews.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const analytics = calculateAnalytics(productReviews, productId);
        return NextResponse.json(analytics);

    } catch (error) {
        console.error('Product Analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
