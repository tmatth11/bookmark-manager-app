"use client";

import { usePathname } from "next/navigation";
import { FetchedBookmark } from "@/types";
import BookmarkForm from "./bookmark-form";

export default function BookmarkFormWrapper({
    bookmark,
}: {
    bookmark?: FetchedBookmark;
}) {
    const pathname = usePathname();

    return <BookmarkForm key={pathname} bookmark={bookmark} />;
}
