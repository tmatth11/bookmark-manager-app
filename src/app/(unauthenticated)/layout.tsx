import Footer from "../_components/footer";
import Navbar from "./_components/navbar";

export default function UnauthenticatedLayout({ children }: LayoutProps<"/">) {
    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
}
