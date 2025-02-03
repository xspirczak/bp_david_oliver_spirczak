import { Outlet } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar"

export function Layout() {
    return (
        <>
            <NavigationBar></NavigationBar>
            <main>
                <Outlet/>
            </main>
        </>
    )
}