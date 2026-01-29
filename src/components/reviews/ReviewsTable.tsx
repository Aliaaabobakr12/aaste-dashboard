'use client';

import React from 'react';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getExpandedRowModel,
} from '@tanstack/react-table';
import { ProcessedReview } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TripletHighlighter } from './TripletHighlighter';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, Smile, Meh, Frown } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

const columns: ColumnDef<ProcessedReview>[] = [
    {
        id: "expander",
        header: () => null,
        cell: ({ row }) => {
            return (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => row.toggleExpanded()}
                >
                    {row.getIsExpanded() ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            )
        },
    },
    {
        accessorKey: 'review_text',
        header: "Review Preview",
        cell: ({ row }) => (
            <div className="max-w-md truncate text-right font-arabic" dir="rtl">
                {row.getValue('review_text')}
            </div>
        ),
    },
    {
        accessorKey: 'star_rating',
        header: "Rating",
        cell: ({ row }) => <div className="text-center">{row.getValue('star_rating')} ★</div>,
    },
    {
        accessorKey: 'overall_sentiment',
        header: "Sentiment",
        cell: ({ row }) => {
            const sentiment = row.getValue('overall_sentiment') as string;

            if (sentiment === 'POS') {
                return <div className="flex justify-center"><Smile className="text-green-600 h-5 w-5" /></div>;
            }
            if (sentiment === 'NEG') {
                return <div className="flex justify-center"><Frown className="text-red-600 h-5 w-5" /></div>;
            }
            return <div className="flex justify-center"><Meh className="text-yellow-600 h-5 w-5" /></div>;
        },
    },
    {
        accessorKey: 'scraped_at',
        header: "Date",
        cell: ({ row }) => {
            const date = row.getValue('scraped_at') as string;
            return <div className="text-sm text-gray-500">
                {date ? format(new Date(date), 'PP') : 'N/A'}
            </div>;
        },
    },
];

interface ReviewsTableProps {
    data: ProcessedReview[];
}

export function ReviewsTable({ data }: ReviewsTableProps) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
    });

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableRow
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {row.getIsExpanded() && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="bg-gray-50/50 p-4">
                                                <div className="p-4 bg-white rounded-lg border shadow-sm">
                                                    <h4 className="text-sm font-semibold mb-2 text-gray-500">Analysis Visualization</h4>
                                                    <div className="text-lg">
                                                        <TripletHighlighter
                                                            text={row.original.review_text}
                                                            triplets={row.original.parsed_triplets}
                                                        />
                                                    </div>
                                                    <div className="mt-4 flex gap-2 flex-wrap">
                                                        {row.original.parsed_triplets.map((t, i) => (
                                                            <Badge key={i} variant="secondary" className="text-xs">
                                                                {t.aspect_text} ({t.sentiment})
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                pageIndex={table.getState().pagination.pageIndex}
                pageSize={table.getState().pagination.pageSize}
                pageCount={table.getPageCount()}
                canPreviousPage={table.getCanPreviousPage()}
                canNextPage={table.getCanNextPage()}
                previousPage={() => table.previousPage()}
                nextPage={() => table.nextPage()}
                setPageIndex={(idx) => table.setPageIndex(idx)}
            />
        </div>
    );
}
