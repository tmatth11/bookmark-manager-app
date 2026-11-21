import Footer from "@/app/_components/footer";
import TopBar from "../_components/top-bar";
import EditProfileView from "./_components/edit-profile-view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Profile",
    description: "Update your profile picture and/or change your username."
}

export default function EditProfilePage() {
    return (
        <>
            <TopBar />
            <EditProfileView />
            <Footer />
        </>
    );
}
