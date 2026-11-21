import { buttonVariants } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { FileQuestionMark } from "lucide-react";
import Link from "next/link";

export default function NotFoundView() {
    return (
        <main className="bg-secondary min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FileQuestionMark />
                        </EmptyMedia>
                        <EmptyTitle>Page Not Found</EmptyTitle>
                        <EmptyDescription>
                            This page is either invalid or you are unauthorized
                            to view it.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Link
                            href="/bookmarks"
                            className={buttonVariants({
                                variant: "default",
                            })}
                        >
                            Return to Bookmarks Page
                        </Link>
                    </EmptyContent>
                </Empty>
            </div>
        </main>
    );
}
