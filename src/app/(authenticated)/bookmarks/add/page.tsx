import Footer from "@/app/_components/footer";
import TopBar from "../../_components/top-bar";
import { Metadata } from "next";
import BookmarkFormView from "../_components/bookmark-form-view";

export const metadata: Metadata = {
    title: "Add Bookmark",
    description: "Fill out the form below to add a bookmark.",
};

export default function AddBookmarkPage() {
    return (
        <>
            <TopBar />
            <BookmarkFormView />
            <Footer />
        </>
    );
}
