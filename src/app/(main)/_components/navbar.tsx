import Logo from "@/app/_components/logo";
import ModeToggle from "@/app/_components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
    return (
        <header className="border-b sticky top-0 z-50 bg-card w-full">
            <div className="max-w-7xl px-4 py-4 sm:px-6 lg:px-8 mx-auto">
                {/* Top navbar */}
                <nav className="flex items-center justify-between">
                    <Logo />
                    <div className="flex items-center gap-4">
                        <Link
                            href="#"
                            className="nav-link">Log In</Link>
                        <Link
                            href="#"
                            className={buttonVariants({
                                size: "lg",
                                variant: "default",
                                className: "text-base!"
                            })}
                        >
                            Sign Up
                        </Link>
                        <ModeToggle />
                    </div>
                </nav>
            </div>
        </header>
    );
}
