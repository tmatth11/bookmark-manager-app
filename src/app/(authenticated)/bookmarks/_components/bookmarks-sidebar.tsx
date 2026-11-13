"use client";

import Logo from "@/app/_components/logo";
import { Button } from "@/components/ui/button";
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
    useSidebar,
} from "@/components/ui/sidebar";
import { Archive, House, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function BookmarksSideBar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar();

    const isArchived = searchParams.get("archived") === "true";

    const handleArchive = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("archived", "true");

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className="flex justify-between gap-2">
                    <Logo path="/bookmarks" />
                    <Button
                        variant="ghost"
                        className="md:hidden"
                        aria-label="Close sidebar"
                        title="Close sidebar"
                        onClick={() => setOpenMobile(false)}
                    >
                        <X />
                    </Button>
                </div>
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
