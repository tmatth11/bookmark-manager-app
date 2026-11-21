import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CallToAction() {
    return (
        <section className="bg-muted/50 mx-auto w-full max-w-4xl rounded-md px-4 text-center py-14">
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Ready to keep track of your favorite websites?
                </h2>
                <p>
                    Log in or sign up if you haven&apos;t already to get
                    started.
                </p>
                <div className="flex items-center gap-2">
                    <Link
                        href="/auth/sign-up"
                        className={buttonVariants({
                            size: "lg",
                        })}
                    >
                        Sign Up
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
