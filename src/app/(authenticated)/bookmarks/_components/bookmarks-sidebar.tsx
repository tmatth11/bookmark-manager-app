"use client";

import Logo from "@/app/_components/logo";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Archive, House } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function BookmarksSideBar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isArchived = searchParams.get("archived") === "true";

    const handleArchive = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("archived", "true");

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <Logo path="/bookmarks" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            isActive={!isArchived}
                            render={<Link href="/bookmarks" />}
                        >
                            <House />
                            <span>Home</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton
                            isActive={isArchived}
                            onClick={handleArchive}
                            render={<Link href="/bookmarks?archived=true" />}
                        >
                            <Archive />
                            <span>Archived</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarGroup>
                    <SidebarGroupLabel>TAGS</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {/* TODO: Render tags */}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
