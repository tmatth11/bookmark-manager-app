import { SidebarProvider } from "@/components/ui/sidebar";
import BookmarksSideBar from "./_components/bookmarks-sidebar";
import Footer from "@/app/_components/footer";
import MenuBar from "./_components/menu-bar";
import BookmarksView from "./_components/bookmarks-view";

export const instant = false;

export default async function BookmarksPage({
    searchParams,
}: {
    searchParams?: Promise<{
        archived?: string;
    }>;
}) {
    const userSearchParams = await searchParams;
    const isArchived = userSearchParams?.archived === "true"

    return (
        <div className="mx-auto w-full max-w-[1920px]">
            <SidebarProvider>
                <BookmarksSideBar className="relative border-r" />
                <main className="w-full">
                    <MenuBar />
                    <BookmarksView isArchived={isArchived} />
                </main>
            </SidebarProvider>
            <Footer />
        </div>
    );
}
