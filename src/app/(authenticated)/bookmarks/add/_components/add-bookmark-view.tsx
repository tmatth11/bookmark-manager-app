import { Suspense } from "react";
import AddBookmarkFormWrapper from "./add-bookmark-form-wrapper";

export default function AddBookmarkView() {
    return (
        <main className="bg-secondary min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col">
                <h3 className="text-xl font-semibold">Add Bookmark</h3>
                <p>Fill out the form below to add a bookmark.</p>
                <Suspense fallback={<p className="mt-4">Loading...</p>}>
                    <AddBookmarkFormWrapper />
                </Suspense>
            </div>
        </main>
    );
}
