import AddBookmarkButton from "./add-bookmark-button";
import MobileSidebarTrigger from "./mobile-sidebar-trigger";
import TitleSearch from "./title-search";

export default function MenuBar() {
    return (
        <div className="bg-card flex items-center justify-between p-4 gap-2">
            <div className="flex items-center gap-2">
                <MobileSidebarTrigger />
                <TitleSearch />
            </div>
            <div className="flex items-center gap-2">
                <AddBookmarkButton />
            </div>
        </div>
    );
}
