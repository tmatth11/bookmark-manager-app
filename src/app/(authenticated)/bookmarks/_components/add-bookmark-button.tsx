import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AddBookmarkButton() {
    return (
        <Link
            href="/bookmarks/add"
            className={buttonVariants({
                size: "lg",
                variant: "default",
                className: "text-base! flex items-center",
            })}
        >
            <Plus size="60" />
            <span className="hidden md:block">Add Bookmark</span>
        </Link>
    );
}
