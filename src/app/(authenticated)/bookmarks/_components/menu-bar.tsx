import ModeToggle from "@/app/_components/mode-toggle";
import AddBookmarkButton from "./add-bookmark-button";
import MobileSidebarTrigger from "./mobile-sidebar-trigger";
import TitleSearch from "./title-search";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Suspense } from "react";
import UserAvatarDropdown from "../../_components/user-avatar-dropdown";

export default function MenuBar() {
    return (
        <header className="top-bar">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <MobileSidebarTrigger />
                    <TitleSearch />
                </div>
                <div className="flex items-center gap-2">
                    <AddBookmarkButton />
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
