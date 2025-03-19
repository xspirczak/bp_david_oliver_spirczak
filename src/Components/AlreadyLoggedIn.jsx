import {useNavigate} from "react-router-dom";
import {useState} from "react";
import LogOutAlert from "./LogOutAlert.jsx";

export default function AlreadyLoggedIn({setIsLoggedIn, setUser, navigateTo}) {
    const navigate = useNavigate();
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    // Trigger the alert instead of logging out immediately
    const handleLogoutClick = () => {
        setShowLogoutAlert(true);
    };

    // Called when the user confirms logout in the alert
    const confirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
        setUser(null);
        setIsLoggedIn(false);
        setShowLogoutAlert(false);
        navigate('/login');
    };

    // Called when the user cancels the logout
    const dismissLogout = () => {
        setShowLogoutAlert(false);
    };


    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen h-screen lg:py-0">
                <div className="bg-white md:rounded-91 rounded-3xl shadow w-5/6 sm:w-2/3 flex justify-center p-6">


                    <div className="grid justify-center p-6 gap-6">
                        <h3 className="text-fontSize28 text-custom-dark-blue font-bold text-center">Už ste
                            prihlásený.</h3>
                        <div className="md:flex grid justify-center gap-6">
                            <button type="button" onClick={() => navigateTo('/')}
                                    className="flex justify-center font-semibold items-center md:w-1/3 w-full px-6 py-2 ml-3 bg-custom-dark-blue text-white text-fontSize16 rounded-3xl hover:bg-custom-dark-blue-hover focus:outline-none">Domovská
                                stránka
                            </button>
                            <button type="button" onClick={() => navigateTo('/profile')}
                                    className="flex justify-center font-semibold items-center md:w-1/3 w-full px-6 py-2 ml-3 bg-custom-dark-blue text-white text-fontSize16 rounded-3xl hover:bg-custom-dark-blue-hover focus:outline-none">Profil
                            </button>
                            <button type="button" onClick={handleLogoutClick}
                                    className="flex justify-center font-semibold items-center md:w-1/3 w-full px-6 py-2 ml-3 bg-custom-dark-blue text-white text-fontSize16 rounded-3xl hover:bg-custom-dark-blue-hover focus:outline-none">Odhlásiť
                                sa
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            {showLogoutAlert && (
                <LogOutAlert onConfirm={confirmLogout} onDismiss={dismissLogout} />
            )}
            </section>


    )
}