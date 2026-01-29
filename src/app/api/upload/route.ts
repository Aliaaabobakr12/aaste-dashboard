import { NextRequest, NextResponse } from 'next/server';
import { saveUpload } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!file.name.endsWith('.json')) {
            return NextResponse.json({ error: 'File must be a JSON file' }, { status: 400 });
        }

        const text = await file.text();
        let jsonContent;
        try {
            jsonContent = JSON.parse(text);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid JSON content' }, { status: 400 });
        }

        if (!Array.isArray(jsonContent)) {
            return NextResponse.json({ error: 'JSON must be an array of reviews' }, { status: 400 });
        }

        const safeOriginalName = file.name.replace('.json', '').replace(/[^a-zA-Z0-9-_]/g, '_');
        const jobId = `${uuidv4()}__${safeOriginalName}`;
        const filename = `${jobId}.json`;
        await saveUpload(filename, jsonContent);

        return NextResponse.json({
            jobId,
            message: 'File uploaded successfully',
            count: jsonContent.length
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
