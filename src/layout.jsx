import { Outlet } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar"
import Footer from "./Components/Footer.jsx";

export function Layout({ isLoggedIn, setIsLoggedIn, user, setUser }) {
    return (
        <>
            <NavigationBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser}></NavigationBar>
            <main>
                <Outlet/>
            </main>
            <Footer></Footer>
        </>
    )
}