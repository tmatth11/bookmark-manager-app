import SortBy from "./sort-by";

export default function BookmarksViewHeader({
    isArchived,
}: {
    isArchived: boolean;
}) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-center">
                {isArchived ? "Archived" : "All"} Bookmarks
            </h3>
            <SortBy />
        </div>
    );
}
