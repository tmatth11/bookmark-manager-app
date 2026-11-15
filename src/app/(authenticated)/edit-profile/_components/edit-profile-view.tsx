import { Suspense } from "react";
import EditProfileForm from "./edit-profile-form";

export default function EditProfileView() {
    return (
        <main className="bg-secondary min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col">
                <h3 className="text-xl font-semibold">Edit Profile</h3>
                <Suspense fallback={<p className="mt-4">Loading...</p>}>
                    <EditProfileForm />
                </Suspense>
            </div>
        </main>
    );
}
