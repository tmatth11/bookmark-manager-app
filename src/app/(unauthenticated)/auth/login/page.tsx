import { Metadata } from "next";
import { connection } from "next/server";
import { createClient } from "@/services/supabase/server";
import { redirect } from "next/navigation";
import LoginFormWrapper from "./_components/login-form-wrapper";

export const metadata: Metadata = {
    title: "Log In",
    description: "Log in using your email and password",
};

export const instant = false;

export default async function LoginPage() {
    await connection();

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect("/bookmarks");
    }

    return (
        <div className="main-layout">
            <div className="flex flex-col items-center">
                <LoginFormWrapper />
            </div>
        </div>
    );
}
