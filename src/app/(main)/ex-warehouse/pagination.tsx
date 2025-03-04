import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export function Pagination({ page, setPage, totalPages }) {
    const pageNumbers = [];

    if (totalPages <= 7) {
        // If total pages are less than or equal to 7, show all pages
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        // Always show first 3 pages
        pageNumbers.push(1, 2, 3);

        // Add "..." if current page is not close to the start
        if (page > 5) pageNumbers.push("...");

        // Add current page and neighbors
        if (page > 3 && page < totalPages - 2) {
            pageNumbers.push(page - 1, page, page + 1);
        }

        // Add "..." before the last 3 pages if necessary
        if (page < totalPages - 4) pageNumbers.push("...");

        // Always show last 3 pages
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
    }

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                >
                    <ChevronsLeft className="w-5 h-5" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                {pageNumbers.map((num, index) =>
                    num === "..." ? (
                        <span key={index} className="px-2 text-gray-500">
                            ...
                        </span>
                    ) : (
                        <Button
                            key={index}
                            variant={page === num ? "default" : "outline"}
                            size="icon"
                            onClick={() => setPage(num)}
                        >
                            {num}
                        </Button>
                    )
                )}

                <Button
                    variant="outline"
                    size="icon"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    disabled={page === totalPages}
                    onClick={() => setPage(totalPages)}
                >
                    <ChevronsRight className="w-5 h-5" />
                </Button>
            </div>
            <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
            </span>
        </div>
    );
}
