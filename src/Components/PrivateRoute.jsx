import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ isLoggedIn }) {
    // If the user is not logged in, redirect to the login page
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    // If logged in, render the child route (the protected page)
    return <Outlet />;
}

export default PrivateRoute;
