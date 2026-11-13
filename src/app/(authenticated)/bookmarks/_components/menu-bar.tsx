import ModeToggle from "@/app/_components/mode-toggle";
import AddBookmarkButton from "./add-bookmark-button";
import MobileSidebarTrigger from "./mobile-sidebar-trigger";
import TitleSearch from "./title-search";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Suspense } from "react";
import UserAvatarDropdown from "./user-avatar-dropdown";

export default function MenuBar() {
    return (
        <div className="bg-card flex items-center justify-between p-4 gap-2 border-b">
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
    );
}
