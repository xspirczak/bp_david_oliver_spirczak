import { Outlet } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar"
import Footer from "./Components/Footer.jsx";
import CookieBanner from "./Components/CookieBanner.jsx";

export function Layout({ isLoggedIn, setIsLoggedIn, user, setUser }) {
    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser}></NavigationBar>
            <main className="flex-grow">
                <Outlet/>
            </main>
            <CookieBanner />
            <Footer></Footer>
        </div>
    )
}