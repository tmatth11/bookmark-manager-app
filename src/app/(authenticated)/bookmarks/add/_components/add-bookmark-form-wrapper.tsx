"use client";

import { usePathname } from "next/navigation";
import AddBookmarkForm from "./add-bookmark-form";
import { FetchedBookmark } from "@/types";

export default function UpdateUsernameWrapper({
    bookmark,
}: {
    bookmark?: FetchedBookmark;
}) {
    const pathname = usePathname();

    return <AddBookmarkForm key={pathname} bookmark={bookmark} />;
}
