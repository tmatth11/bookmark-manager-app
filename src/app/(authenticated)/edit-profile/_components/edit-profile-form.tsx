import { fetchCurrentProfile } from "@/lib/queries/profile";
import { connection } from "next/server";
import AvatarUpload from "./avatar-upload";
import UpdateUsernameWrapper from "./update-username-wrapper";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const instant = false;

export default async function EditProfileForm() {
    await connection();

    const profile = await fetchCurrentProfile();

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Edit profile</CardTitle>
                <CardDescription>
                    Update your profile picture and/or change your username.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {profile ? (
                    <>
                        <AvatarUpload profile={profile} />
                        <UpdateUsernameWrapper profile={profile} />
                    </>
                ) : <p className="form-error">Error: No profile found.</p>}
            </CardContent>
        </Card>
    );
}
