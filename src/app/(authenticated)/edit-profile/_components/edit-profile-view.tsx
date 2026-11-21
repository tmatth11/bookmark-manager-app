import { Suspense } from "react";
import EditProfileForm from "./edit-profile-form";

export default function EditProfileView() {
    return (
        <main className="bg-secondary min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center">
                <Suspense fallback={<p className="mt-4">Loading...</p>}>
                    <EditProfileForm />
                </Suspense>
            </div>
        </main>
    );
}
