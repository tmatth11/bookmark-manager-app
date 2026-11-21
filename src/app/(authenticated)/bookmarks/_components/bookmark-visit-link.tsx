"use client";

import { updateVisit } from "@/actions/bookmark-actions";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Bookmark } from "@/types";
import Link from "next/link";

export default function BookmarkVisitLink({
    bookmark,
}: {
    bookmark: Bookmark;
}) {
    const handleVisit = async () => {
        await updateVisit(bookmark.id, bookmark.userId);
    };

    return (
        <Link
            href={bookmark.pageUrl}
            className="h-full min-w-0 flex-1 overflow-y-auto pr-1 wrap-break-word cursor-pointer hover:underline"
            target="_blank"
            onClick={handleVisit}
        >
            <CardTitle>{bookmark.title}</CardTitle>
            <CardDescription>{bookmark.pageUrl}</CardDescription>
        </Link>
    );
}
