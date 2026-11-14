"use client";

import { updateAvatarUrl } from "@/actions/profile-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/services/supabase/client";
import { Profile } from "@/types";
import { useRef, useState } from "react";

export default function AvatarUpload({ profile }: { profile: Profile }) {
    let avatarFallback = "?";
    const previousAvatarUrl = profile?.avatar_url || null;
    if (profile) {
        avatarFallback = profile.username[0].toUpperCase();
    }

    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(previousAvatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!profile) return;

        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("Error: Image must be selected.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();

            // Recommended by Supabase to upload to a new path every time
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const filePath = `${profile.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatar")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from("avatar")
                .getPublicUrl(filePath);
            
            await updateAvatarUrl(data.publicUrl, previousAvatarUrl);
            setAvatarUrl(data.publicUrl);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown database error occurred";

            console.error("Error uploading image:", errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold">Upload Avatar</h4>
            <div className="mt-2 flex flex-col items-center gap-2 md:flex-row">
                <Avatar size="lg">
                    {avatarUrl && <AvatarImage src={avatarUrl} />}
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                {profile && (
                    <>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            Upload avatar
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="single"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </>
                )}
            </div>
        </div>
    );
}
