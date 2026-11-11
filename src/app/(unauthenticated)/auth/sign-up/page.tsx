import { Metadata } from "next";
import SignUpForm from "./_components/sign-up-form";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/services/supabase/server";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Sign up using an email, username, and password",
};

export const instant = false;

export default async function SignUpPage() {
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
            <div className="flex min-h-dvh flex-col items-center">
                <SignUpForm />
            </div>
        </div>
    );
}
