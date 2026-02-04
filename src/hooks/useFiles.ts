import { useQuery } from '@tanstack/react-query';
import { FileMetadata } from '@/types';

async function fetchFiles(): Promise<FileMetadata[]> {
    const res = await fetch('/api/files');
    if (!res.ok) {
        throw new Error('Failed to fetch files');
    }
    return res.json();
}

export function useFiles() {
    return useQuery({
        queryKey: ['files'],
        queryFn: fetchFiles,
    });
}
