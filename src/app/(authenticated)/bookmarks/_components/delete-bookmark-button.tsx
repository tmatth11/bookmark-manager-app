"use client";

import { deleteBookmark } from "@/actions/bookmark-actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Bookmark } from "@/types";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DeleteBookmarkButton({
    bookmark,
    currentPage
}: {
    bookmark: Bookmark;
    currentPage: number;
}) {
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();

    const isArchived = searchParams.get("archived") === "true";
    const query = searchParams.get("query") ?? "";
    const tags = searchParams.getAll("tag");
    const sortBy = searchParams.get("sort-by") ?? "recently-added";

    const handleDelete = async () => {
        setLoading(true);
        await deleteBookmark(bookmark.id, bookmark.userId, currentPage, isArchived, query, tags, sortBy);
        setLoading(false);
    };

    return (
        <DropdownMenuItem
            className={"cursor-pointer"}
            onClick={handleDelete}
            disabled={loading}
        >
            Delete
        </DropdownMenuItem>
    )
}
