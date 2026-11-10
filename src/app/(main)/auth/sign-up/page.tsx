import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Sign up using an email, username, and password",
};

export default function SignUpPage() {
    return (
        <div className="main-layout">
            <p>SignUpPage works!</p>
        </div>
    );
}