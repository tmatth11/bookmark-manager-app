"use server";

import { createClient } from "@/services/supabase/server";
import { UpdateUsernameState } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateAvatarPath(
    newAvatarPath: string,
    previousAvatarPath: string | null,
) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (!user || error) {
        throw new Error("Could not obtain current user information.");
    }

    // Delete old avatar URL if user is changing theirs
    if (
        previousAvatarPath &&
        newAvatarPath &&
        previousAvatarPath !== newAvatarPath
    ) {
        const { error: removeError } = await supabase.storage
            .from("avatar")
            .remove([previousAvatarPath]);

        if (removeError) {
            throw removeError;
        }
    }

    // Update avatar_url in database
    const { error: updateError } = await supabase
        .from("profile")
        .update({
            avatar_path: newAvatarPath,
        })
        .eq("id", user.id);

    // Return error if update operation has failed
    if (updateError) {
        throw updateError;
    }

    // Revalidate pages
    revalidatePath("/bookmarks");
    revalidatePath("/edit-profile");
}

export async function updateUsername(
    prevState: UpdateUsernameState,
    formData: FormData,
): Promise<UpdateUsernameState> {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (!user || error) {
        return { error: "Error: Could not obtain current user information." };
    }

    const username = formData.get("username") as string;

    if (!username) {
        return { error: "Error: Username was not provided." };
    }

    const { error: updateError } = await supabase
        .from("profile")
        .update({
            username: username,
        })
        .eq("id", user.id);
    
    if (updateError) {
        return { error: "Error: Username could not be updated." };
    }

    revalidatePath("/edit-profile");
    revalidatePath("/bookmarks");

    return { success: true };
}
