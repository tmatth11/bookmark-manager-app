"use client";

import { updateArchive } from "@/actions/bookmark-actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Bookmark } from "@/types";

export default function BookmarkArchiveLink({
    bookmark
}: {
    bookmark: Bookmark;
}) {
    const handleArchive = async () => {
        await updateArchive(bookmark.id, bookmark.userId);
    };

    return (
        <DropdownMenuItem
            onClick={handleArchive}
            className={"cursor-pointer"}
        >
            <span>{bookmark.isArchived ? "Unarchive" : "Archive"}</span>
        </DropdownMenuItem>
    );
}
