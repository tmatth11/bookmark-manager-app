import "../globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: {
        template: "%s | Bookmark Manager App",
        default: "Bookmark Manager App",
    },
};

export default function HomeLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={cn("font-sans", inter.variable)}>
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
