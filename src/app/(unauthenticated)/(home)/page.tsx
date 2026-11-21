import { createClient } from "@/services/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Hero from "./_components/hero";
import CallToAction from "./_components/call-to-action";
import Features from "./_components/features";
import Testimonials from "./_components/testimonials";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
    description:
        "Stop losing track of the links of your favorite websites. Keep all of them in one place instead",
};

export const instant = false;

export default async function HomePage() {
    await connection();

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect("/bookmarks");
    }

    return (
        <div className="main-layout min-h-screen">
            <Hero />
            <Features />
            <Testimonials />
            <CallToAction />
        </div>
    );
}
