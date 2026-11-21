import { Suspense } from "react";
import { FetchedBookmark } from "@/types";
import BookmarkFormWrapper from "./bookmark-form-wrapper";

export default function BookmarkFormView({
    bookmark,
}: {
    bookmark?: FetchedBookmark;
}) {
    return (
        <main className="bg-secondary min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
                <h3 className="text-xl font-semibold">
                    {bookmark ? "Edit" : "Add"} Bookmark
                </h3>
                <p>
                    Fill out the form below to{" "}
                    {bookmark ? "edit your" : "add a"} bookmark.
                </p>
                <Suspense fallback={<p className="mt-4">Loading...</p>}>
                    <BookmarkFormWrapper bookmark={bookmark} />
                </Suspense>
            </div>
        </main>
    );
}
