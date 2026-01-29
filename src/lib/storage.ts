import fs from 'fs/promises';
import path from 'path';
import { UploadJob, Product, ProcessedReview } from '@/types';

// Define paths relative to the project root (process.cwd())
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PROCESSED_DIR = path.join(DATA_DIR, 'processed');

// Ensure directories exist
export async function ensureDirectories() {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.mkdir(PROCESSED_DIR, { recursive: true });
}

// Save uploaded raw file
export async function saveUpload(filename: string, content: any): Promise<string> {
    await ensureDirectories();
    const filePath = path.join(UPLOADS_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    return filePath;
}

// Read processed file
export async function getProcessedFile(jobId: string): Promise<ProcessedReview[]> {
    const filePath = path.join(PROCESSED_DIR, `${jobId}.json`);
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content) as ProcessedReview[];
    } catch (error) {
        console.error(`Error reading processed file ${jobId}:`, error);
        return [];
    }
}

// Save processed results
export async function saveProcessedFile(jobId: string, data: ProcessedReview[]) {
    await ensureDirectories();
    const filePath = path.join(PROCESSED_DIR, `${jobId}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// List all processed files (simulating a database of jobs/products)
export async function listProcessedFiles(): Promise<string[]> {
    await ensureDirectories();
    try {
        const files = await fs.readdir(PROCESSED_DIR);
        return files.filter(f => f.endsWith('.json'));
    } catch (error) {
        return [];
    }
}

// List all processed files with metadata
export async function listProcessedFilesWithMetadata(): Promise<{ name: string; date: string; size: number; rowCount: number }[]> {
    await ensureDirectories();
    try {
        const files = await fs.readdir(PROCESSED_DIR);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        const fileList = await Promise.all(jsonFiles.map(async (file) => {
            const filePath = path.join(PROCESSED_DIR, file);
            const stats = await fs.stat(filePath);

            // Allow basic info even if read fails
            let rowCount = 0;
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const json = JSON.parse(content);
                rowCount = Array.isArray(json) ? json.length : 0;
            } catch (e) {
                console.error(`Error reading row count for ${file}`, e);
            }

            return {
                name: file,
                date: stats.mtime.toISOString(),
                size: stats.size,
                rowCount
            };
        }));

        // Sort by date desc
        return fileList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error("Error listing files with metadata:", error);
        return [];
    }
}

