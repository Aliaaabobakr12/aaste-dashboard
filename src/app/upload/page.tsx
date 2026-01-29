'use client';

import { FileDropzone } from '@/components/upload/FileDropzone';
import { useUpload } from '@/hooks/useUpload';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

export default function UploadPage() {
    const { file, progress, handleUpload, uploadMutation, processMutation } = useUpload();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Upload Reviews</h1>
                <p className="text-sm text-muted-foreground/80">
                    Upload a JSON file containing product reviews to start the analysis.
                </p>
            </div>

            <Separator />

            <Card className="bg-card/50 backdrop-blur-sm border-muted/20">
                <CardContent className="pt-6">
                    <FileDropzone
                        onDrop={handleUpload}
                        file={file}
                        progress={progress}
                        isUploading={uploadMutation.isPending}
                        isProcessing={processMutation.isPending}
                        error={uploadMutation.error || processMutation.error}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
