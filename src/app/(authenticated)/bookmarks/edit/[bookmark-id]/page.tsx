import TopBar from "@/app/(authenticated)/_components/top-bar";
import { getBookmark } from "@/lib/queries/bookmark";
import { notFound } from "next/navigation";
import z from "zod";
import Footer from "@/app/_components/footer";
import { connection } from "next/server";
import { Metadata } from "next";
import BookmarkFormView from "../../_components/bookmark-form-view";

export const metadata: Metadata = {
    title: "Edit Bookmark",
    description: "Fill out the form below to your bookmark.",
};

export const instant = false;

const IdParamSchema = z.coerce.string().pipe(z.uuid());

export default async function EditBookmarkPage({
    params,
}: {
    params: Promise<{
        "bookmark-id": string;
    }>;
}) {
    await connection();

    const resolvedParams = await params;
    const result = IdParamSchema.safeParse(resolvedParams["bookmark-id"]);
    if (!result.success) {
        notFound();
    }

    const bookmarkId = result.data;

    const { data: fetchedBookmark, errorMessage: fetchBookmarkError } =
        await getBookmark(bookmarkId);

    if (!fetchedBookmark || fetchBookmarkError) {
        notFound();
    }

    return (
        <>
            <TopBar />
            <BookmarkFormView bookmark={fetchedBookmark} />
            <Footer />
        </>
    );
}
