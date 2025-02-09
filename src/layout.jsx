import { Outlet } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar"
import Footer from "./Components/Footer.jsx";

export function Layout() {
    return (
        <>
            <NavigationBar></NavigationBar>
            <main>
                <Outlet/>
            </main>
            <Footer></Footer>
        </>
    )
}