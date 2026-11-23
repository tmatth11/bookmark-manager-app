export { cn } from "cn"

export const getDeploymentURL = () => {
    if (process.env.VERCEL_ENV === "production") {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "social-media-app-gules-nine.vercel.app"}`;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};