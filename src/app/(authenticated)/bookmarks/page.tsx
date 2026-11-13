import { SidebarProvider } from "@/components/ui/sidebar";
import BookmarksSideBar from "./_components/bookmarks-sidebar";
import Footer from "@/app/_components/footer";

export const instant = false;

export default function BookmarksPage() {
    return (
        <>
            <div className="max-w-[1920px] mx-auto w-full">
                <SidebarProvider>
                    <BookmarksSideBar className="relative border-r" />
                    <main>
                        <p>Hello</p>
                    </main>
                </SidebarProvider>
            </div>
            <Footer />
        </>
    );
}
