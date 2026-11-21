"use client";

import { usePathname } from "next/navigation";
import SignUpForm from "./sign-up-form";

export default function SignUpFormWrapper() {
    const pathname = usePathname();

    return (
        <SignUpForm key={pathname} />
    )
}