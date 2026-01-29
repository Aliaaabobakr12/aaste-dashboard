'use client';

import { useEffect, useState } from 'react';
import { FileMetadata } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function FilesPage() {
    const [files, setFiles] = useState<FileMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const res = await fetch('/api/files');
            if (!res.ok) throw new Error('Failed to fetch files');
            const data = await res.json();
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
            toast.error('Failed to load files');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (fileName: string) => {
        // Direct link to download if we served static files, but we might need an API 
        // Current architecture: files are in `processed`, we can serve them via an API or public folder.
        // Since they are in `data/processed`, they are NOT public. We need a download endpoint.
        // For now, let's create a simple link to a download API.
        window.open(`/api/files/${fileName}/download`, '_blank');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Processed Files</h2>

            <Card>
                <CardHeader>
                    <CardTitle>File Management</CardTitle>
                </CardHeader>
                <CardContent>
                    {files.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No processed files found. Upload a review file to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Processed Date</TableHead>
                                    <TableHead>Reviews</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {files.map((file) => (
                                    <TableRow key={file.name}>
                                        <TableCell className="font-medium flex items-center">
                                            <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                            {file.name}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(file.date), 'PP p')}
                                        </TableCell>
                                        <TableCell>{file.rowCount}</TableCell>
                                        <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a href={`/files/${file.name}`}>
                                                        View Analysis
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDownload(file.name)}
                                                    title="Download JSON"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
