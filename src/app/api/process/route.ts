import { NextRequest, NextResponse } from 'next/server';
import { saveProcessedFile } from '@/lib/storage';
import { mockProcessReviews } from '@/lib/mockAsteProcessor'; // Keep as fallback/type ref if needed
import { parsePythonTriplets } from '@/lib/aste-parser';
import { ProcessedReview, RawReview } from '@/types';
import fs from 'fs/promises';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'data', 'uploads');
const EXTERNAL_API_URL = process.env.ASTE_API_URL || 'https://abdelrahmangalhom-aaste.hf.space/analyze';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { jobId } = body;

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
        }

        // Read the uploaded file
        const uploadPath = path.join(UPLOADS_DIR, `${jobId}.json`);
        let rawContent: RawReview[];
        try {
            const fileContent = await fs.readFile(uploadPath, 'utf-8');
            rawContent = JSON.parse(fileContent);
        } catch (e) {
            return NextResponse.json({ error: 'Upload not found' }, { status: 404 });
        }

        console.log(`Starting Job ${jobId} with ${rawContent.length} reviews`);

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                const sendEvent = (data: any) => {
                    controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
                };

                const processedReviews: ProcessedReview[] = [];
                const BATCH_SIZE = 10; // Batch for external API to allow partial progress updates

                try {
                    for (let i = 0; i < rawContent.length; i += BATCH_SIZE) {
                        const batch = rawContent.slice(i, i + BATCH_SIZE);
                        const payload = batch.map((r, idx) => ({
                            id: String(i + idx),
                            review_text: r.review_text
                        }));

                        // Call API for this batch
                        const apiResponse = await fetch(EXTERNAL_API_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        if (!apiResponse.ok) {
                            const errText = await apiResponse.text();
                            throw new Error(`API Error ${apiResponse.status}: ${errText}`);
                        }

                        const apiResults: any[] = await apiResponse.json();

                        // Process batch results
                        const batchProcessed: ProcessedReview[] = batch.map((raw, idx) => {
                            const apiResult = apiResults.find(r => r.id === String(i + idx)) || apiResults[idx];
                            const tripletsStr = apiResult?.triplets || "[]";
                            const parsedTriplets = parsePythonTriplets(tripletsStr, raw.review_text);

                            let overallSentiment: 'POS' | 'NEG' | 'NEU' | 'MIXED' = 'NEU';
                            if (parsedTriplets.length > 0) {
                                const hasPos = parsedTriplets.some(t => t.sentiment === 'POS');
                                const hasNeg = parsedTriplets.some(t => t.sentiment === 'NEG');
                                if (hasPos && hasNeg) overallSentiment = 'MIXED';
                                else if (hasPos) overallSentiment = 'POS';
                                else if (hasNeg) overallSentiment = 'NEG';
                            }

                            return {
                                ...raw,
                                id: crypto.randomUUID(),
                                triplets: tripletsStr,
                                parsed_triplets: parsedTriplets,
                                overall_sentiment: overallSentiment
                            };
                        });

                        processedReviews.push(...batchProcessed);

                        // Send progress update
                        const progress = Math.min(Math.round(((i + batch.length) / rawContent.length) * 100), 99);
                        sendEvent({ type: 'progress', value: progress });
                    }

                    // Save final result
                    await saveProcessedFile(jobId, processedReviews);

                    // Send complete event
                    sendEvent({
                        type: 'complete',
                        jobId,
                        message: 'Processing completed successfully',
                        count: processedReviews.length
                    });

                } catch (error: any) {
                    console.error('Stream processing error:', error);
                    sendEvent({ type: 'error', error: error.message || 'Processing failed' });
                } finally {
                    controller.close();
                }
            }
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'application/x-ndjson',
                'Transfer-Encoding': 'chunked'
            }
        });

    } catch (error) {
        console.error('Processing initialization error:', error);
        return NextResponse.json({ error: 'Processing initialization failed' }, { status: 500 });
    }
}
