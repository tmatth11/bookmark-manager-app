"use server";

import { createClient } from "@/services/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAvatarUrl(avatarUrl: string, previousAvatarUrl: string | null) {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
        throw new Error("Could not update avatar_url in database.");
    }

    // Delete old avatar URL if user is changing theirs
    if (previousAvatarUrl && previousAvatarUrl !== avatarUrl) {
        // Extract relative path from the Supabase public URL string
        try {
            const urlParts = previousAvatarUrl.split("/avatar/");
            if (urlParts.length > 1) {
                const oldStoragePath = urlParts[1];

                await supabase.storage.from("avatar").remove([oldStoragePath]);
            }
        }
        catch (storageError) {
            throw storageError;
        }
    }

    // Update avatar_url in database
    const { error: updateError } = await supabase
        .from("profile")
        .update({
            avatar_url: avatarUrl,
        })
        .eq("id", user.id);

    // Return error if update operation has failed
    if (updateError) {
        throw(updateError);
    }

    // Revalidate pages
    revalidatePath("/bookmarks");
    revalidatePath("/edit-profile");
}