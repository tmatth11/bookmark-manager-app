import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Log In",
    description: "Log in using your email and password",
};

export default function LoginPage() {
    return (
        <div className="main-layout">
            <p>LoginPage works!</p>
        </div>
    );
}