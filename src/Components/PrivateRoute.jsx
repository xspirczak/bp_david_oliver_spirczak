import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ isLoggedIn }) {
    // Ak používateľ nie je prihlásený a skúsi prejsť na zabezpečenú stránku, tak ho presmeruj na login
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    // Ak je prihlásený zobraz mu požadovanú stránku
    return <Outlet />;
}

export default PrivateRoute;
