"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/services/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const isFormInvalid =
        isLoading || [email, password].some((field) => !field.trim());

    const handleError = (errorMessage: string) => {
        setError(errorMessage);

        setTimeout(() => {
            setError(null);
        }, 3000);
    };

    const handleLogin = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const supabase = createClient();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            if (!data.user) {
                throw new Error(
                    "Error: Log in completed, but no user was returned.",
                );
            }

            router.push("/bookmarks");
        } catch (error: unknown) {
            handleError(
                error instanceof Error ? `Error: ${error.message}.`: "An error occurred",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Log In</CardTitle>
                <CardDescription>
                    Log in with your email and password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Field>
                        {error && <p className="form-error">{error}</p>}
                        <Field>
                            <Button type="submit" disabled={isFormInvalid}>
                                Log In
                            </Button>
                            <FieldDescription className="px-6 text-center">
                                Don&apos;t have an account?{" "}
                                <Link href="/auth/sign-up">Sign up</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
