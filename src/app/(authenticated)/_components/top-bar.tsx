import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import ModeToggle from "@/app/_components/mode-toggle";
import UserAvatarDropdown from "./user-avatar-dropdown";

export default function TopBar() {
    return (
        <header className="top-bar">
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                <Link
                    href="/bookmarks"
                    className="link-hover flex items-center gap-2"
                    title="Back to home"
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
            </div>
        </header>
    );
}
