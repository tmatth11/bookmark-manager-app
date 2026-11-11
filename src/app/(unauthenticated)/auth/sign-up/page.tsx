import { Metadata } from "next";
import SignUpForm from "./_components/sign-up-form";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Sign up using an email, username, and password",
};

export default function SignUpPage() {
    return (
        <div className="main-layout">
            <div className="flex flex-col items-center min-h-dvh">
                <SignUpForm />
            </div>
        </div>
    );
}
