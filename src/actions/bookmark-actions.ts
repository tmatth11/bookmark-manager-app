"use server";

import { getBookmarksPages } from "@/lib/queries/bookmark";
import { createClient } from "@/services/supabase/server";
import { BookmarkFormState } from "@/types";
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
    prevState: BookmarkFormState,
    formData: FormData,
): Promise<BookmarkFormState> {
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

export async function updateVisit(bookmarkId: string, ownerId: string) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (!user || error) {
        return;
    }

    if (ownerId !== user.id) {
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

export async function updateArchive(bookmarkId: string, ownerId: string) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (!user || error) {
        return;
    }

    if (ownerId !== user.id) {
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

    const redirectPath = updatedArchiveStatus
        ? "/bookmarks?archived=true"
        : "/bookmarks";

    redirect(redirectPath);
}

export async function togglePin(bookmarkId: string, ownerId: string) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (!user || error) {
        return;
    }

    if (ownerId !== user.id) {
        return;
    }

    const { data: bookmarkPinStatus, error: getBookmarkPinStatusError } =
        await supabase
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

export async function deleteBookmark(
    bookmarkId: string,
    ownerId: string,
    currentPage: number,
    isArchived: boolean,
    query: string,
    tags: string[],
    sortBy: string,
) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (!user || error) {
        return;
    }

    if (ownerId !== user.id) {
        return;
    }

    const { error: deleteError } = await supabase
        .from("bookmark")
        .delete()
        .eq("id", bookmarkId);

    if (deleteError) {
        return;
    }

    revalidatePath("/bookmarks");

    const { data: totalPages, errorMessage } = await getBookmarksPages(
        isArchived,
        query,
        tags,
    );

    if (!totalPages || errorMessage) {
        redirect("/bookmarks");
    }

    if (currentPage > totalPages && totalPages > 0) {
        const params = new URLSearchParams();
        if (query) {
            params.set("query", query);
        }

        params.set("sort-by", sortBy);

        if (isArchived) {
            params.set("archived", "true");
        }
        tags.forEach((tag) => {
            params.append("tag", tag);
        });
        params.set("page", totalPages.toString());

        redirect(`/bookmarks?${params.toString()}`);
    }
}

const editBookmarkSchema = addBookmarkSchema.extend({
    id: z.string().min(1, "Bookmark ID is required."),
    userId: z.string().min(1, "User ID is required."),
});

export async function editBookmark(
    prevState: BookmarkFormState,
    formData: FormData,
) {
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

    // Validate form fields
    const validatedFields = editBookmarkSchema.safeParse({
        id: formData.get("bookmark-id"),
        userId: formData.get("user-id"),
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

    const { id, userId, pageUrl, title, description, tags } =
        validatedFields.data;

    // Only allow owner to update bookmark
    if (userId !== user.id) {
        return {
            errorMessage: "Error: User doesn't own bookmark.",
        };
    }

    // Update bookmark in bookmark table
    const { data: updatedBookmark, error: updateBookmarkError } = await supabase
        .from("bookmark")
        .update({
            page_url: pageUrl,
            title: title,
            description: description,
        })
        .eq("id", id)
        .select()
        .single();

    if (!updatedBookmark || updateBookmarkError) {
        return {
            errorMessage: "Error: Unable to update bookmark in database.",
        };
    }

    // Delete existing bookmark_tags
    const { error: deleteTagsError } = await supabase
        .from("bookmark_tag")
        .delete()
        .eq("bookmark_id", updatedBookmark.id);

    if (deleteTagsError) {
        return {
            errorMessage: "Error: Unable to update bookmark tags.",
        };
    }

    if (tags.length === 0) {
        revalidatePath("/bookmarks");
        redirect("/bookmarks");
    }

    const uniqueTags = Array.from(new Set(tags));

    // Upsert tags to tag table
    const { data: upsertedTags, error: upsertTagsError } = await supabase
        .from("tag")
        .upsert(
            uniqueTags.map((name) => ({
                user_id: user.id,
                name,
            })),
            {
                onConflict: "user_id, name",
                ignoreDuplicates: false,
            },
        )
        .select("id, name");

    if (upsertTagsError || !upsertedTags) {
        return {
            errorMessage: "Error: Unable to save tags to database.",
        };
    }

    // Insert fresh bookmark_tags
    const { error: addBookmarkTagsError } = await supabase
        .from("bookmark_tag")
        .insert(
            upsertedTags.map((tag) => ({
                bookmark_id: updatedBookmark.id,
                tag_id: tag.id,
            })),
        );

    if (addBookmarkTagsError) {
        return {
            errorMessage: "Error: Unable to link updated tags to bookmark.",
        };
    }

    revalidatePath("/bookmarks");
    redirect("/bookmarks");
}
