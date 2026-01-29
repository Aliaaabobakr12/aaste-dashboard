import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';

interface FileDropzoneProps {
    onDrop: (files: File[]) => void;
    isUploading: boolean;
    isProcessing: boolean;
    error?: Error | null;
    file: File | null;
    progress?: number;
}

export function FileDropzone({ onDrop, isUploading, isProcessing, error, file, progress = 0 }: FileDropzoneProps) {
    const onDropCallback = useCallback((acceptedFiles: File[]) => {
        onDrop(acceptedFiles);
    }, [onDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onDropCallback,
        accept: {
            'application/json': ['.json'],
        },
        maxFiles: 1,
        disabled: isUploading || isProcessing,
    });

    return (
        <Card className="max-w-xl mx-auto mt-8 border-dashed border-2">
            <CardContent className="p-0">
                <div
                    {...getRootProps()}
                    className={cn(
                        "flex flex-col items-center justify-center p-10 cursor-pointer transition-colors min-h-[300px]",
                        isDragActive ? "bg-emerald-50/50" : "hover:bg-gray-50/50",
                        (isUploading || isProcessing) && "cursor-not-allowed opacity-70"
                    )}
                >
                    <input {...getInputProps()} />

                    {isProcessing ? (
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                            <div>
                                <h3 className="text-lg font-semibold text-blue-600">Processing Reviews...</h3>
                                <p className="text-sm text-gray-500 mb-4">Running ASTE model on uploaded content</p>
                                <Progress value={progress} className="w-[300px] h-2" />
                                <p className="text-xs text-gray-400 mt-2">{progress}% Complete</p>
                            </div>
                        </div>
                    ) : isUploading ? (
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
                            <div>
                                <h3 className="text-lg font-semibold text-emerald-600">Uploading File...</h3>
                                <p className="text-sm text-gray-500">Please wait while we upload your reviews</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-600">Upload Failed</h3>
                                <p className="text-sm text-gray-500">{error.message}</p>
                                <p className="text-xs text-gray-400 mt-2">Click to try again</p>
                            </div>
                        </div>
                    ) : file ? (
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                            <div>
                                <h3 className="text-lg font-semibold">Ready to process</h3>
                                <p className="text-sm text-gray-500">{file.name}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <Upload className="h-8 w-8 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Drop your JSON file here</h3>
                                <p className="text-sm text-gray-500">or click to browse</p>
                            </div>
                            <div className="text-xs text-gray-400">
                                Supports JSON files containing review arrays
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
