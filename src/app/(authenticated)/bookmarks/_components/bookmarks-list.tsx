import { getBookmarks } from "@/lib/queries/bookmark";
import BookmarkCard from "./bookmark-card";

export default async function BookmarksList({
    isArchived,
    sortBy,
    query,
    currentPage,
    tags,
}: {
    isArchived: boolean;
    sortBy: string;
    query: string;
    currentPage: number;
    tags: string[];
}) {
    const { data: bookmarks, errorMessage: bookmarksError } =
        await getBookmarks(isArchived, sortBy, query, currentPage, tags);

    if (bookmarksError || !bookmarks) {
        return (
            <p className="form-error w-full">
                An error occurred while fetching bookmarks.
            </p>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <p className="w-full text-center">
                There are no bookmarks to display.
            </p>
        );
    }

    return (
        <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
        </div>
    );
}
