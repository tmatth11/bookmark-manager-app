"use server";

import { createClient } from "@/services/supabase/server";

export async function getTags() {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            data: null,
            error: "Error: No user has been found.",
        };
    }

    const userId = user.id;

    const { data: tags, error: tagsError } = await supabase
        .from("tag")
        .select(
            `
            id,
            name,
            bookmark_tag!inner(
                bookmark!inner(user_id)
            )
        `,
        )
        .eq("bookmark_tag.bookmark.user_id", userId);

    if (tagsError) {
        console.error("tagsError =", tagsError);
        return {
            data: null,
            error: "Error: Unable to fetch bookmark tags.",
        };
    }

    const formattedTags = tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        count: tag.bookmark_tag.length,
    }));
    
    return {
        data: formattedTags,
        error: null,
    };
}
