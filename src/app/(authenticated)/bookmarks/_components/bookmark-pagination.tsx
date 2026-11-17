"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

export default function BookmarkPagination({
    totalPages,
}: {
    totalPages: number;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const validTotalPages = Math.max(1, totalPages);

    const rawPage = Number(searchParams.get("page")) || 1;
    const currentPage = Math.min(rawPage, validTotalPages);

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);

        if (pageNumber == validTotalPages + 1) {
            params.set("page", "1");
        } else if (pageNumber == 0) {
            params.set("page", validTotalPages.toString());
        } else {
            params.set("page", pageNumber.toString());
        }
        return `${pathname}?${params.toString()}`;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={createPageURL(currentPage - 1)}
                        aria-label="Previous page"
                        title="Previous page"
                    />
                </PaginationItem>
                <PaginationItem>
                    {currentPage} of {validTotalPages}
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        href={createPageURL(currentPage + 1)}
                        aria-label="Next page"
                        tabIndex={-1}
                        title="Next page"
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
