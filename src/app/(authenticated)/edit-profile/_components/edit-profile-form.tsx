import { fetchCurrentProfile } from "@/lib/queries/profile";
import { connection } from "next/server";
import AvatarUpload from "./avatar-upload";
import UpdateUsername from "./update-username";

export const instant = false;

export default async function EditProfileForm() {
    await connection();

    const profile = await fetchCurrentProfile();

    return (
        <div className="mt-4 flex flex-col items-center gap-10">
            {profile && (
                <>
                    <AvatarUpload profile={profile} />
                    <UpdateUsername key={profile.id} profile={profile} />
                </>
            )}
        </div>
    );
}
