'use client';

import { useEffect, useState } from 'react';
import { FileMetadata } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useFiles } from '@/hooks/useFiles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function FilesPage() {
    const { data: files = [], isLoading } = useFiles();
    const queryClient = useQueryClient();

    const handleDownload = (fileName: string) => {
        window.open(`/api/files/${fileName}/download`, '_blank');
    };

    const getDisplayName = (fileName: string) => {
        const parts = fileName.replace('.json', '').split('__');
        return parts.length > 1 ? parts[1] : fileName;
    };

    const handleDelete = async (fileName: string) => {
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`/api/files/${fileName}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete file');

            toast.success('File and insights deleted successfully');

            // Invalidate all queries to ensure dashboard and details update
            await queryClient.invalidateQueries({ queryKey: ['files'] });
            await queryClient.invalidateQueries({ queryKey: ['products'] });
            await queryClient.invalidateQueries({ queryKey: ['product'] });
            await queryClient.invalidateQueries({ queryKey: ['reviews'] });

        } catch (error) {
            console.error('Error deleting file:', error);
            toast.error('Failed to delete file');
        }
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
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-1">Processed Files</h2>
                <p className="text-sm text-muted-foreground/80">
                    Manage and review all uploaded and analyzed files.
                </p>
            </div>

            <Card className="bg-card/40 backdrop-blur-sm border-emerald-500/10 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]">
                <CardHeader>
                    <CardTitle className="text-xl">File Management</CardTitle>
                </CardHeader>
                <CardContent>
                    {files.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No processed files found. Upload a review file to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-emerald-500/10 text-muted-foreground">
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Processed Date</TableHead>
                                    <TableHead>Reviews</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {files.map((file) => (
                                    <TableRow key={file.name} className="hover:bg-emerald-500/5 border-emerald-500/10 transition-colors">
                                        <TableCell className="font-medium flex items-center">
                                            <div className="bg-emerald-500/10 p-2 rounded-lg mr-3">
                                                <FileText className="h-4 w-4 text-emerald-400" />
                                            </div>
                                            {getDisplayName(file.name)}
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
                                                    className="border-primary/20 hover:bg-primary/20 hover:text-primary"
                                                    asChild
                                                >
                                                    <a href={`/files/${file.name}`}>
                                                        View Analysis
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-muted"
                                                    onClick={() => handleDownload(file.name)}
                                                    title="Download JSON"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-red-500/10 hover:text-red-500 text-muted-foreground"
                                                    onClick={() => handleDelete(file.name)}
                                                    title="Delete File"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
