import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-card w-full border-t">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <Link 
                    className="flex items-center gap-2 link-hover"
                    href="https://github.com/tmatth11/bookmark-manager-app"
                    target="_blank"
                >

                    <span className="text-sm">
                        bookmark-manager-app
                    </span>
                    <SquareArrowOutUpRight size="14" />
                </Link>
            </div>
        </footer>
    );
}
