
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    canPreviousPage: boolean;
    canNextPage: boolean;
    previousPage: () => void;
    nextPage: () => void;
    setPageIndex: (index: number) => void;
}

export function Pagination({
    pageIndex,
    pageCount,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    setPageIndex,
}: PaginationProps) {
    // Generate page numbers to show
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show on each side of current
        const range = [];
        const rangeWithDots = [];

        for (let i = 0; i < pageCount; i++) {
            // Show first, last, and pages around current index
            if (
                i === 0 ||
                i === pageCount - 1 ||
                (i >= pageIndex - delta && i <= pageIndex + delta)
            ) {
                range.push(i);
            }
        }

        let l;
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    };

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                Page {pageIndex + 1} of {pageCount}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPageIndex(0)}
                    disabled={!canPreviousPage}
                >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={previousPage}
                    disabled={!canPreviousPage}
                >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page, i) => (
                    typeof page === 'number' ? (
                        <Button
                            key={i}
                            variant={pageIndex === page ? "default" : "outline"}
                            className="h-8 w-8 p-0"
                            onClick={() => setPageIndex(page)}
                        >
                            {page + 1}
                        </Button>
                    ) : (
                        <span key={i} className="px-2 text-muted-foreground">...</span>
                    )
                ))}

                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={nextPage}
                    disabled={!canNextPage}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPageIndex(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
