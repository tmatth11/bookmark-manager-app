"use server";

import { createClient } from "@/services/supabase/server";
import { AddBookmarkState } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const convertEmptyToNull = z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val));

const addBookmarkSchema = z.object({
    pageUrl: z
        .string()
        .trim()
        .min(1, "Page URL cannot be empty.")
        .pipe(z.url("Please enter a valid URL.")),
    title: z.string().trim().min(1, "Title cannot be empty."),
    description: convertEmptyToNull,
    tags: z.array(z.string().trim().min(1)),
});

export async function addBookmark(
    prevState: AddBookmarkState,
    formData: FormData,
): Promise<AddBookmarkState> {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    // Only allow authenticated users to add bookmarks
    if (!user || error) {
        return {
            errorMessage: "Error: User must be logged in to add bookmarks.",
        };
    }

    const validatedFields = addBookmarkSchema.safeParse({
        pageUrl: formData.get("page-url"),
        title: formData.get("title"),
        description: formData.get("description"),
        tags: formData.getAll("tags"),
    });

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            errorMessage: "Error: Missing or invalid fields.",
        };
    }

    // Insert user_id, page_url, title, description, and icon_url into bookmark table
    const { data: newBookmark, error: addBookmarkError } = await supabase
        .from("bookmark")
        .insert({
            user_id: user.id,
            page_url: validatedFields.data.pageUrl,
            title: validatedFields.data.title,
            description: validatedFields.data.description,
        })
        .select()
        .single();

    if (!newBookmark || addBookmarkError) {
        return {
            errorMessage: "Error: Unable to add bookmark to database.",
        };
    }

    // Exit early if there are no tags to add
    if (validatedFields.data.tags.length === 0) {
        revalidatePath("/bookmarks");
        redirect("/bookmarks");
    }

    // Insert new tags into tag table
    const { data: addedTags, error: addTagsError } = await supabase
        .from("tag")
        .upsert(
            validatedFields.data.tags.map((tag) => ({
                user_id: user.id,
                name: tag,
            })),
            {
                onConflict: "user_id, name",
                ignoreDuplicates: false,
            },
        )
        .select();

    if (addTagsError) {
        return {
            errorMessage: "Error: Unable to add new tags to database.",
        };
    }

    // Insert corresponding bookmark_id and tag_id into bookmark_tag table
    if (addedTags) {
        const { error: addBookmarkTagsError } = await supabase
            .from("bookmark_tag")
            .insert(
                addedTags.map((addedTag) => ({
                    tag_id: addedTag.id,
                    bookmark_id: newBookmark.id,
                })),
            );

        if (addBookmarkTagsError) {
            return {
                errorMessage: "Error: Unable to add bookmark tags to database.",
            };
        }
    }

    revalidatePath("/bookmarks");
    redirect("/bookmarks");
}

export async function updateVisit(bookmarkId: string) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (!user || error) {
        return;
    }

    const { data: bookmarkVisits, error: getBookmarkVisitsError } =
        await supabase
            .from("bookmark")
            .select("visits")
            .eq("id", bookmarkId)
            .single();

    if (!bookmarkVisits || getBookmarkVisitsError) {
        return;
    }

    const updatedVisits = bookmarkVisits.visits + 1;

    const { error: updateVisitError } = await supabase
        .from("bookmark")
        .update({
            visits: updatedVisits,
            visited_at: new Date().toISOString(),
        })
        .eq("id", bookmarkId);

    if (updateVisitError) {
        return;
    }

    revalidatePath("/bookmarks");
}

export async function updateArchive(bookmarkId: string) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (!user || error) {
        return;
    }

    const {
        data: bookmarkArchiveStatus,
        error: getBookmarkArchiveStatusError,
    } = await supabase
        .from("bookmark")
        .select("is_archived")
        .eq("id", bookmarkId)
        .single();

    if (!bookmarkArchiveStatus || getBookmarkArchiveStatusError) {
        return;
    }

    const updatedArchiveStatus = !bookmarkArchiveStatus.is_archived;

    const { error: updateArchiveError } = await supabase
        .from("bookmark")
        .update({
            is_archived: updatedArchiveStatus,
        })
        .eq("id", bookmarkId);

    if (updateArchiveError) {
        return;
    }

    revalidatePath("/bookmarks");

    const redirectPath = updatedArchiveStatus ? "/bookmarks?archived=true" : "/bookmarks";

    redirect(redirectPath);
}

export async function togglePin(bookmarkId: string) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (!user || error) {
        return;
    }

    const {
        data: bookmarkPinStatus,
        error: getBookmarkPinStatusError,
    } = await supabase
        .from("bookmark")
        .select("is_pinned")
        .eq("id", bookmarkId)
        .single();

    if (!bookmarkPinStatus || getBookmarkPinStatusError) {
        return;
    }

    const updatedPinStatus = !bookmarkPinStatus.is_pinned;

    const { error: updatePinError } = await supabase
        .from("bookmark")
        .update({
            is_pinned: updatedPinStatus,
        })
        .eq("id", bookmarkId);

    if (updatePinError) {
        return;
    }

    revalidatePath("/bookmarks");
}
