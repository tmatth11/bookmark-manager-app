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
    iconUrl: convertEmptyToNull.pipe(
        z.url("Please enter a valid icon URL.").nullable(),
    ),
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
        iconUrl: formData.get("icon-url"),
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
            icon_url: validatedFields.data.iconUrl,
        })
        .select()
        .single();

    if (!newBookmark || addBookmarkError) {
        return {
            errorMessage: "Error: Unable to add bookmark to database.",
        };
    }

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
