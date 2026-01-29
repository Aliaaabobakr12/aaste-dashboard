import { NextRequest, NextResponse } from 'next/server';
import { listProcessedFiles, getProcessedFile } from '@/lib/storage';
import { ProcessedReview } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
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

        const productReviews = allReviews.filter(r => r.product_name === productId);

        return NextResponse.json(productReviews);

    } catch (error) {
        console.error('Product Reviews error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
