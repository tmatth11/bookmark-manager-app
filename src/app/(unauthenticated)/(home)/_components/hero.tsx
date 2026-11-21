import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="pt-10 mx-auto w-full max-w-4xl min-h-[75svh]">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="max-w-md">
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                        Never <span className="text-purple-600">lose</span> another
                        URL again
                    </h1>
                    <p className="text-muted-foreground">
                        Stop losing track of the links of your favorite
                        websites.
                    </p>
                    <p className="text-muted-foreground">
                        Keep all of them in one place instead.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/auth/sign-up"
                        className={buttonVariants({
                            size: "lg",
                        })}
                    >
                        Try It Free
                    </Link>
                    <Link
                        href="/auth/login"
                        className={buttonVariants({
                            size: "lg",
                            variant: "outline",
                        })}
                    >
                        Log In
                    </Link>
                </div>
            </div>
        </section>
    );
}
