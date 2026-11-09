import Link from "next/link";
import { Bookmark } from "lucide-react";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 nav-link">
            <div className="shrink-0 rounded-md bg-primary p-1 text-white">
                <Bookmark />
            </div>
            <span className="font-semibold">
                Bookmark Manager
            </span>
        </Link>
    );
}
