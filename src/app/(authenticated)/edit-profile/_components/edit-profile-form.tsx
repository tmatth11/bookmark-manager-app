import { fetchCurrentProfile } from "@/lib/queries/profile";
import { connection } from "next/server";
import AvatarUpload from "./avatar-upload";

export const instant = false;

export default async function EditProfileForm() {
    await connection();

    const profile = await fetchCurrentProfile();

    return (
        <div className="mt-4">
            <AvatarUpload profile={profile} />
        </div>
    );
}
