"use client";

import { usePathname } from "next/navigation";
import AddBookmarkForm from "./add-bookmark-form";

export default function UpdateUsernameWrapper() {
    const pathname = usePathname();

    return (
        <AddBookmarkForm key={pathname} />
    );
}