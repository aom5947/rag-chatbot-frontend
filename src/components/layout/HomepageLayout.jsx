import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

const HomepageLayout = () => {
    return (
        <main>
            <Navbar />
            <Outlet />
            <Footer />
        </main>
    )
}
export default HomepageLayout