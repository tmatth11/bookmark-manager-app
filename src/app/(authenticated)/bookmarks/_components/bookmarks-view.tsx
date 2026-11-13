import BookmarksList from "./bookmarks-list";
import BookmarksViewHeader from "./bookmarks-view-header";

export default function BookmarksView({ isArchived }: { isArchived: boolean }) {
    return (
        <div className="bg-secondary flex min-h-dvh flex-col px-4 py-8 sm:px-6 lg:px-8">
            <BookmarksViewHeader isArchived={isArchived} />
            <BookmarksList />
        </div>
    );
}
