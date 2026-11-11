import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { ThemeProvider } from "./_components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: {
        template: "%s | Bookmark Manager App",
        default: "Bookmark Manager App",
    },
};

export default function MainLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${cn("font-sans", inter.variable)} flex min-h-dvh flex-col antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
