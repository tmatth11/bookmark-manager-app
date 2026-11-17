import { SidebarProvider } from "@/components/ui/sidebar";
import BookmarksSideBar from "./_components/bookmarks-sidebar";
import Footer from "@/app/_components/footer";
import MenuBar from "./_components/menu-bar";
import BookmarksViewHeader from "./_components/bookmarks-view-header";
import BookmarksList from "./_components/bookmarks-list";
import { getBookmarksPages } from "@/lib/queries/bookmark";
import { connection } from "next/server";

export const instant = false;

export default async function BookmarksPage({
    searchParams,
}: {
    searchParams?: Promise<{
        archived?: string;
        "sort-by"?: string;
        page?: string;
        query?: string;
        tag?: string | string[];
    }>;
}) {
    await connection();

    const userSearchParams = await searchParams;

    const isArchived = userSearchParams?.archived === "true";

    const sortBy = userSearchParams?.["sort-by"] || "recently-added";

    const rawQuery = userSearchParams?.query || "";
    const query = rawQuery.trim();

    const currentPage = Number(userSearchParams?.page) || 1;

    const rawTag = userSearchParams?.tag;
    const tags = Array.isArray(rawTag) ? rawTag : rawTag ? [rawTag] : [];

    const { data: totalPages, errorMessage } = await getBookmarksPages(
        isArchived,
        query,
        tags,
    );

    return (
        <div className="mx-auto w-full max-w-[1920px]">
            <SidebarProvider>
                <BookmarksSideBar className="relative h-full border-r" />
                <div className="w-full">
                    <MenuBar />
                    <main className="bg-secondary flex min-h-dvh flex-col px-4 py-8 sm:px-6 lg:px-8">
                        <BookmarksViewHeader isArchived={isArchived} />
                        {errorMessage !== null || totalPages !== null ? (
                            <p className="form-error">
                                {errorMessage}
                            </p>
                        ) : (
                            <>
                                <BookmarksList />
                            </>
                        )}
                    </main>
                </div>
            </SidebarProvider>
            <Footer />
        </div>
    );
}
