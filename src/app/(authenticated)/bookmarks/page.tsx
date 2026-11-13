import { SidebarProvider } from "@/components/ui/sidebar";
import BookmarksSideBar from "./_components/bookmarks-sidebar";
import Footer from "@/app/_components/footer";
import MenuBar from "./_components/menu-bar";

export const instant = false;

export default function BookmarksPage() {
    return (
        <div className="mx-auto max-w-[1920px] w-full">
            <SidebarProvider>
                <BookmarksSideBar className="relative border-r" />
                <main className="w-full">
                    <MenuBar />
                </main>
            </SidebarProvider>
            <Footer />
        </div>
    );
}
