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

    // Show "..." if there's a gap between first page and current page -1
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
        <Pagination className="justify-start">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e: any) => {
                            e.preventDefault();
                            setPage((prev) => Math.max(1, prev - 1));
                        }
                        }
                        disabled={page === 1}
                    />
                </PaginationItem>

                {pageNumbers.map((num, index) =>
                    num === "..." ? (
                        <PaginationItem key={index}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href="#"
                                isActive={page === num}
                                onClick={(e: any) => {
                                    e.preventDefault();
                                    setPage(num as number);
                                    }
                                }
                            >
                                {num}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e: any) => {
                            e.preventDefault();
                            setPage((prev) => Math.min(totalPages, prev + 1));
                            }
                        }
                        disabled={page === totalPages}
                    />
                </PaginationItem>

                <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                </span>
            </PaginationContent>
        </Pagination>
    );
}
