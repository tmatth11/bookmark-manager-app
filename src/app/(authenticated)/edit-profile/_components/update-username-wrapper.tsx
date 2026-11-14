"use client";

import { usePathname } from "next/navigation";
import UpdateUsername from "./update-username";
import { Profile } from "@/types";

export default function UpdateUsernameWrapper({ profile }: { profile: Profile }) {
    const pathname = usePathname();

    return (
        <UpdateUsername key={`${pathname}-${profile.username}`} profile={profile} />
    );
}