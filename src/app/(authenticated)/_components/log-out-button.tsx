"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createClient } from "@/services/supabase/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LogOutButton() {
    const supabase = createClient();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSignOut = async () => {
        await supabase.auth.signOut();

        startTransition(() => {
            router.push("/");
            router.refresh();
        })
    }

    return (
        <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isPending}
            className={"cursor-pointer"}
        >
            {isPending ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
    );
}