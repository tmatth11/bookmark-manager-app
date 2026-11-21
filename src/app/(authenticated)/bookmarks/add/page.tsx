import Footer from "@/app/_components/footer";
import TopBar from "../../_components/top-bar";
import AddBookmarkView from "./_components/add-bookmark-view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Add Bookmark",
    description: "Fill out the form below to add a bookmark.",
};

export default function AddBookmarkPage() {
    return (
        <>
            <TopBar />
            <AddBookmarkView />
            <Footer />
        </>
    );
}
