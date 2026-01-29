import { NextResponse } from 'next/server';
import { listProcessedFilesWithMetadata } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const files = await listProcessedFilesWithMetadata();
        return NextResponse.json(files);
    } catch (error) {
        console.error('Files API error:', error);
        return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
    }
}
