"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export default function MobileSidebarTrigger() {
    const { setOpenMobile } = useSidebar();

    return (
        <div className="md:hidden">
            <Button 
                variant="outline" 
                size="icon-lg"
                aria-label="Open sidebar"
                title="Open sidebar"
                onClick={() => setOpenMobile(true)}
            >
                <Menu />
            </Button>
        </div>
    );
}
