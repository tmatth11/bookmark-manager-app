import { Metadata } from "next";
import LoginForm from "./_components/login-form";

export const metadata: Metadata = {
    title: "Log In",
    description: "Log in using your email and password",
};

export default function LoginPage() {
    return (
        <div className="main-layout">
            <div className="flex flex-col items-center">
                <LoginForm />
            </div>
        </div>
    );
}