import { getBookmarks } from "@/lib/queries/bookmark";

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
    const { data: bookmarks, errorMessage: bookmarksError } = await getBookmarks(
        isArchived,
        sortBy,
        query,
        currentPage,
        tags,
    );

    if (bookmarksError || !bookmarks) {
        return (
            <p className="form-error w-full">An error occurred while fetching bookmarks.</p>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <p className="text-center w-full">There are no bookmarks to display.</p>
        )
    }

    return (
        <div className="w-full">
            {bookmarks.map((bookmark) => (
                <p key={bookmark.id}>Bookmark</p>
            ))}
        </div>
    );
}
