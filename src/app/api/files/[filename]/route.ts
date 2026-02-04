import { NextRequest, NextResponse } from 'next/server';
import { deleteProcessedFile } from '@/lib/storage';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;

    if (!filename) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    try {
        const success = await deleteProcessedFile(filename);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'File not found or could not be deleted' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
