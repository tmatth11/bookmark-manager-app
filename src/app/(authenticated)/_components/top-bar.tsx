import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import ModeToggle from "@/app/_components/mode-toggle";
import UserAvatarDropdown from "./user-avatar-dropdown";

export default function TopBar() {
    return (
        <header className="top-bar">
            <Link
                href="/bookmarks"
                className="link-hover flex items-center gap-2"
            >
                <ChevronLeft />
                <span>Back</span>
            </Link>
            <div className="flex items-center gap-2">
                <Suspense
                    fallback={
                        <Avatar>
                            <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                    }
                >
                    <UserAvatarDropdown />
                </Suspense>
                <ModeToggle />
            </div>
        </header>
    );
}
