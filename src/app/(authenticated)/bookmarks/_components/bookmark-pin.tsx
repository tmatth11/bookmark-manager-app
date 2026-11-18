"use client";

import { togglePin } from "@/actions/bookmark-actions";
import { Toggle } from "@/components/ui/toggle";
import { Bookmark } from "@/types";
import { Pin } from "lucide-react";

export default function BookmarkPin({ bookmark }: { bookmark: Bookmark }) {
    const handleTogglePin = async () => {
        await togglePin(bookmark.id, bookmark.userId);
    }

    return (
        <Toggle 
            className={"shrink-0"} 
            pressed={bookmark.isPinned}
            onPressedChange={handleTogglePin}
            title={bookmark.isPinned ? "Unpin bookmark" : "Pin bookmark"}
            aria-label={bookmark.isPinned ? "Unpin bookmark" : "Pin bookmark"}
        >
            <Pin size={16} fill={bookmark.isPinned ? "white" : "none"} />
        </Toggle>
    );
}
