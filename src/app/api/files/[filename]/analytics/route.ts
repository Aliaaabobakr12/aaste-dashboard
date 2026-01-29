import { NextRequest, NextResponse } from 'next/server';
import { getProcessedFile } from '@/lib/storage';
import { calculateAnalytics } from '@/lib/analyticsCalculator';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    try {
        const { filename } = await params;
        // Filename likely needs decoding if passed as URL param, but usually filename in path is fine.
        // However, nextjs params are already decoded usually? Let's check. 
        // Actually filenames might have extensions .json.

        let jobId = filename;
        if (jobId.endsWith('.json')) {
            jobId = jobId.replace('.json', '');
        }

        const reviews = await getProcessedFile(jobId);

        if (!reviews || reviews.length === 0) {
            return NextResponse.json({ error: 'File not found or empty' }, { status: 404 });
        }

        // We treat the file as a "Product" for analytics purposes, using the filename as the name.
        const analytics = calculateAnalytics(reviews, filename);

        return NextResponse.json(analytics);

    } catch (error) {
        console.error('File Analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
