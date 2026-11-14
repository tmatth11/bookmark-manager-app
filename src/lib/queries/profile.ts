"use server";

import { createClient } from "@/services/supabase/server";

export async function fetchCurrentProfile() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        console.error("Error: No user has been found.");
        
        return null;
    }

    const userId = user.id;

    const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select() 
        .eq("id", userId)
        .single();
    
    if (profileError || !profile) {
        console.error("Error: Could not fetch profile.");
        
        return null;
    }

    return profile;
}