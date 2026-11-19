import TopBar from "@/app/(authenticated)/_components/top-bar";
import { getBookmark } from "@/lib/queries/bookmark";
import { notFound } from "next/navigation";
import z from "zod";
import AddBookmarkView from "../../add/_components/add-bookmark-view";
import Footer from "@/app/_components/footer";
import { connection } from "next/server";

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

    const { data: bookmark, errorMessage: bookmarkError } =
        await getBookmark(bookmarkId);

    if (!bookmark || bookmarkError) {
        notFound();
    }

    return (
        <>
            <TopBar />
            <AddBookmarkView />
            <Footer />
        </>
    );
}
