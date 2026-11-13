import Link from "next/link";
import { Bookmark } from "lucide-react";

export default function Logo({ onLinksClose, onSidebarClose, path }: { 
    onLinksClose?: () => void;
    onSidebarClose?: () => void;
    path: string; 
}) {
    const handleClick = () => {
        onLinksClose?.();
        onSidebarClose?.();
    };

    return (
        <Link
            href={path}
            className="link-hover flex items-center gap-2"
            onClick={handleClick}
        >
            <div className="bg-primary shrink-0 rounded-md p-1 text-white">
                <Bookmark />
            </div>
            <span className="text-center font-semibold">Bookmark Manager</span>
        </Link>
    );
}
