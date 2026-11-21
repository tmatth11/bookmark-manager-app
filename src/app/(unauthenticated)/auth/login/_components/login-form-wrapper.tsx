"use client";

import { usePathname } from "next/navigation";
import LoginForm from "./login-form";

export default function LoginFormWrapper() {
    const pathname = usePathname();

    return (
        <LoginForm key={pathname} />
    );
}