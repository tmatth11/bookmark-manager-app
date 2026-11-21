import TopBar from "./(authenticated)/_components/top-bar";
import Footer from "./_components/footer";
import NotFoundView from "./_components/not-found-view";

export default function NotFound() {
    return (
        <>
            <TopBar />
            <NotFoundView />
            <Footer />
        </>
    )
}