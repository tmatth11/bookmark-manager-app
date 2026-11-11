import { createClient } from "@/services/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";

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
        <div className="main-layout">
            <p>HomePage works!</p>
        </div>
    );
}
