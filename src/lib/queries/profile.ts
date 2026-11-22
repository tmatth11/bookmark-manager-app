"use server";

import { createClient } from "@/services/supabase/server";

export async function fetchCurrentProfile() {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        console.error("Error: No user has been found.");

        return null;
    }

    const userId = user.id;

    // Get profile belonging to the current user
    const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select()
        .eq("id", userId)
        .single();

    if (profileError || !profile) {
        console.error("Error: Could not fetch profile.");

        return null;
    }

    let signedAvatarUrl: string | null = null;

    // Update avatar URL with new signed URL
    if (profile.avatar_path) {
        const { data, error: signError } = await supabase.storage
            .from("avatar")
            .createSignedUrl(profile.avatar_path, 3600);

        if (signError) {
            console.error(
                "Error generating signed avatar URL:",
                signError.message,
            );

            return null;
        }
        signedAvatarUrl = data.signedUrl;
    }

    return {
        ...profile,
        avatar_url: signedAvatarUrl
    };
}
