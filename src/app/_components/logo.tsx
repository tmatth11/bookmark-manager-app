import Link from "next/link";
import { Bookmark } from "lucide-react";

export default function Logo({ onLinksClose, path }: { 
    onLinksClose?: () => void;
    path: string; 
}) {
    return (
        <Link
            href={path}
            className="link-hover flex items-center gap-2"
            onClick={onLinksClose}
        >
            <div className="bg-primary shrink-0 rounded-md p-1 text-white">
                <Bookmark />
            </div>
            <span className="text-center font-semibold">Bookmark Manager</span>
        </Link>
    );
}
