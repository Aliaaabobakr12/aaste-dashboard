'use client';

import { FileDropzone } from '@/components/upload/FileDropzone';
import { useUpload } from '@/hooks/useUpload';
import { Separator } from '@/components/ui/separator';

export default function UploadPage() {
    const { file, progress, handleUpload, uploadMutation, processMutation } = useUpload();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Upload Reviews</h1>
                <p className="text-muted-foreground">
                    Upload a JSON file containing product reviews to start the analysis.
                </p>
            </div>

            <Separator />

            <div className="mt-6">
                <FileDropzone
                    onDrop={handleUpload}
                    file={file}
                    progress={progress}
                    isUploading={uploadMutation.isPending}
                    isProcessing={processMutation.isPending}
                    error={uploadMutation.error || processMutation.error}
                />
            </div>
        </div>
    );
}
