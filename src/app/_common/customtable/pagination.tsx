import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

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
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setPage((prev) => Math.max(1, prev - 1));
                        }}
                        disabled={page === 1}
                    />
                </PaginationItem>

                {/* Page Numbers */}
                {pageNumbers.map((num, index) =>
                    num === "..." ? (
                        <PaginationItem key={index} className="hidden sm:flex">
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href="#"
                                isActive={page === num}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(num as number);
                                }}
                                className="px-2 sm:px-3 md:px-4 py-1 text-sm"
                            >
                                {num}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                {/* Next Button */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setPage((prev) => Math.min(totalPages, prev + 1));
                        }}
                        disabled={page === totalPages}
                    />
                </PaginationItem>

                {/* Page Indicator (Only on Mobile) */}
                <span className="text-sm text-gray-600 block">
                    {page} / {totalPages}
                </span>
            </PaginationContent>
        </Pagination>
    );
}
