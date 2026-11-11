import { Metadata } from "next";
import LoginForm from "./_components/login-form";
import { connection } from "next/server";
import { createClient } from "@/services/supabase/server";
import { redirect } from "next/navigation";

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
                <LoginForm />
            </div>
        </div>
    );
}
