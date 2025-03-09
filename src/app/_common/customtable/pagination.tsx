import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    // PaginationLink,
    // PaginationNext,
    // PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
}

export function PaginationComponent({ page, setPage, totalPages }: PaginationProps) {
    const pageNumbers: (number | string)[] = [];

    // Always show first page
    pageNumbers.push(1);

    // Show "..." if there's a gap before current page -1
    if (page > 3) {
        pageNumbers.push("...");
    }

    // Show current page -1, current page, and current page +1 (if within range)
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        if (!pageNumbers.includes(i)) pageNumbers.push(i);
    }

    // Show "..." if there's a gap before the last page
    if (page < totalPages - 2) {
        pageNumbers.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
        pageNumbers.push(totalPages);
    }

    return (
        <Pagination className="justify-start w-full">
            <PaginationContent className="flex flex-wrap gap-1">
                {/* Previous Button */}
                <PaginationItem>
                    <Button
                        variant="ghost"
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                </PaginationItem>

                {/* Page Numbers */}
                {pageNumbers.map((num, index) =>
                    num === "..." ? (
                        <PaginationItem key={index} className="hidden sm:flex">
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={index}>
                            <Button
                                variant={page === num ? "default" : "outline"}
                                onClick={() => setPage(num as number)}
                                className="px-2 sm:px-3 md:px-4 py-1 text-sm"
                            >
                                {num}
                            </Button>
                        </PaginationItem>
                    )
                )}

                {/* Next Button */}
                <PaginationItem>
                    <Button
                        variant="ghost"
                        disabled={page === totalPages}
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </PaginationItem>

                {/* Page Indicator (Only on Mobile) */}
                <span className="text-sm text-gray-600 block">
                    {page} / {totalPages}
                </span>
            </PaginationContent>
        </Pagination>
    );
}
