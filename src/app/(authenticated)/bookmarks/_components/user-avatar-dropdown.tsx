import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchCurrentProfile } from "@/lib/queries/profile";
import { connection } from "next/server";
import UserAvatarImage from "./user-avatar-image";
import Link from "next/link";
import LogOutButton from "./log-out-button";

export const instant = false;

export default async function UserAvatarDropdown() {
    await connection();

    const profile = await fetchCurrentProfile();

    let avatarFallback = "?";
    const avatarUrl = profile?.avatar_url || null;
    if (profile) {
        avatarFallback = profile.username[0].toUpperCase();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <UserAvatarImage
                        avatarFallback={avatarFallback}
                        avatarUrl={avatarUrl}
                    />
                }
            />
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Profile actions</DropdownMenuLabel>
                    {profile && (
                        <DropdownMenuItem
                            render={<Link href="/edit-profile" className="cursor-pointer">Edit profile</Link>}
                        />
                    )}
                    <LogOutButton />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
