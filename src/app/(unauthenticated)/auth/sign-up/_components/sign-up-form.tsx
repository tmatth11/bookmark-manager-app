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

export default function SignUpForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const isFormInvalid =
        isLoading ||
        [email, username, password, confirmPassword].some(
            (field) => !field.trim(),
        );

    const handleError = (errorMessage: string) => {
        setError(errorMessage);

        setTimeout(() => {
            setError(null);
        }, 3000);
    };

    const handleSignUp = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const supabase = createClient();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            handleError("Error: Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                    },
                },
            });

            if (error) {
                throw error;
            }

            if (!data.user) {
                throw new Error(
                    "Error: Sign up completed, but no user was returned.",
                );
            }

            router.push("/bookmarks");
        } catch (error: unknown) {
            handleError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                    Create an account using an email, username, and password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignUp}>
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
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                onChange={(e) => setUsername(e.target.value)}
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
                        <Field>
                            <FieldLabel htmlFor="confirm-password">
                                Confirm Password
                            </FieldLabel>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm password"
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                        </Field>
                        {error && <p className="form-error">{error}</p>}
                        <FieldGroup>
                            <Field>
                                <Button type="submit" disabled={isFormInvalid}>
                                    Create Account
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    Already have an account?{" "}
                                    <Link href="/auth/login">Log in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
