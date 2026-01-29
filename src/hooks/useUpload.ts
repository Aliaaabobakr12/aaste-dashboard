import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UploadResponse {
    jobId: string;
    message: string;
    count: number;
}


export function useUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    const uploadMutation = useMutation({
        mutationFn: async (fileToUpload: File) => {
            const formData = new FormData();
            formData.append('file', fileToUpload);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Upload failed');
            }

            return res.json() as Promise<UploadResponse>;
        },
    });

    const processMutation = useMutation({
        mutationFn: async (jobId: string) => {
            setProgress(0);
            const res = await fetch('/api/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId }),
            });

            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw new Error(error.error || `Processing failed: ${res.statusText}`);
            }

            // Reader for NDJSON stream
            const reader = res.body?.getReader();
            if (!reader) throw new Error('Response body is not readable');

            const decoder = new TextDecoder();
            let finalResult = null;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    try {
                        const event = JSON.parse(line);

                        if (event.type === 'progress') {
                            setProgress(event.value);
                        } else if (event.type === 'complete') {
                            finalResult = event;
                            setProgress(100);
                        } else if (event.type === 'error') {
                            throw new Error(event.error);
                        }
                    } catch (e) {
                        console.warn('Failed to parse stream line:', line, e);
                    }
                }
            }

            return finalResult;
        },
        onSuccess: (data) => {
            // Redirect after brief delay to show 100%
            setTimeout(() => {
                router.push('/products');
            }, 500);
        }
    });

    const handleUploadAndProcess = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];
        setFile(file);

        try {
            const uploadRes = await uploadMutation.mutateAsync(file);
            toast.info('File uploaded, processing...');
            await processMutation.mutateAsync(uploadRes.jobId);
            toast.success('Processing complete!');
        } catch (e: any) {
            console.error(e);
            toast.error(e.message || 'Operation failed');
        }
    };

    return {
        file,
        progress,
        uploadMutation,
        processMutation,
        handleUpload: handleUploadAndProcess,
        reset: () => {
            setFile(null);
            uploadMutation.reset();
            processMutation.reset();
        }
    };
}
