export default function BookmarksList({
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
    return (
        <div className="w-full">
            <p>BookmarksList works!</p>
        </div>
    );
}
