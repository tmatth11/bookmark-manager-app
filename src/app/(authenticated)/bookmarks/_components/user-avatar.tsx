import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchCurrentProfile } from "@/lib/queries/profile";
import Link from "next/link";
import { connection } from "next/server";

export const instant = false;

export default async function UserAvatar() {
    await connection();

    const profile = await fetchCurrentProfile();

    let avatarFallback = "?";
    if (profile) {
        avatarFallback = profile.username[0].toUpperCase();
    }

    if (!profile) {
        return (
            <Avatar>
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
        );
    }

    return (
        <Link href="/edit-profile" title="Edit profile" aria-label="Edit profile">
            <Avatar>
                {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
                <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
        </Link>
    );
}
