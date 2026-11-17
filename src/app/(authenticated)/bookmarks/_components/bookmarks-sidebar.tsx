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
import { useSearchParams } from "next/navigation";
import TagList from "./tag-list";

export default function BookmarksSideBar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const searchParams = useSearchParams();
    const { setOpenMobile } = useSidebar();

    const isArchived = searchParams.get("archived") === "true";

    const handleSidebarClose = () => {
        setOpenMobile(false);
    };

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className="flex justify-between gap-2">
                    <Logo
                        path="/bookmarks"
                        onSidebarClose={handleSidebarClose}
                    />
                    <Button
                        variant="ghost"
                        className="md:hidden"
                        aria-label="Close sidebar"
                        title="Close sidebar"
                        onClick={handleSidebarClose}
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
                            onClick={handleSidebarClose}
                        >
                            <House />
                            <span>Home</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton
                            isActive={isArchived}
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
                        <TagList />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
