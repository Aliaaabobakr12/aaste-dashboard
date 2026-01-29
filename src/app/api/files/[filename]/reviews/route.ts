import { NextRequest, NextResponse } from 'next/server';
import { getProcessedFile } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    try {
        const { filename } = await params;
        let jobId = filename;
        if (jobId.endsWith('.json')) {
            jobId = jobId.replace('.json', '');
        }

        const reviews = await getProcessedFile(jobId);

        if (!reviews) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        return NextResponse.json(reviews);

    } catch (error) {
        console.error('File Reviews error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
