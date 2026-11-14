"use client";

import Logo from "@/app/_components/logo";
import ModeToggle from "@/app/_components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isLinksOpen, setIsLinksOpen] = useState(false);

    const handleLinksClose = () => {
        setIsLinksOpen(false);
    };

    return (
        <header className="bg-card sticky top-0 z-50 w-full border-b">
            <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                {/* Top navbar */}
                <div className="flex items-center justify-between">
                    <Logo onLinksClose={handleLinksClose} path="/" />
                    <div className="flex items-center gap-4">
                        <div className="hidden items-center gap-4 md:flex">
                            <Link href="/auth/login" className="link-hover">
                                Log In
                            </Link>
                            <Link
                                href="/auth/sign-up"
                                className={buttonVariants({
                                    size: "lg",
                                    variant: "default",
                                    className: "text-base!",
                                })}
                            >
                                Sign Up
                            </Link>
                        </div>
                        <ModeToggle />
                        <button
                            className="link-hover md:hidden"
                            aria-label={
                                isLinksOpen ? "Close menu" : "Expand menu"
                            }
                            title={isLinksOpen ? "Close menu" : "Expand menu"}
                            onClick={() => setIsLinksOpen(!isLinksOpen)}
                        >
                            {isLinksOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
                {/* Bottom navbar */}
                <nav
                    className={`${isLinksOpen ? "flex" : "hidden"} mt-4 flex-col gap-2 md:hidden`}
                >
                    <Link 
                        href="/auth/login" 
                        className="link-hover"
                        onClick={handleLinksClose}
                    >
                        Log In
                    </Link>
                    <Link
                        href="/auth/sign-up"
                        className={buttonVariants({
                            size: "lg",
                            variant: "default",
                            className: "text-base!",
                        })}
                        onClick={handleLinksClose}
                    >
                        Sign Up
                    </Link>
                </nav>
            </nav>
        </header>
    );
}
