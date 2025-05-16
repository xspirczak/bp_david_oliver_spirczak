import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LogOutAlert from "./LogOutAlert.jsx";
import { motion } from "framer-motion";
import { FiHome, FiUser, FiLogOut } from "react-icons/fi";

export default function AlreadyLoggedIn({ setIsLoggedIn, setUser, navigateTo }) {
    const navigate = useNavigate();
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    const handleLogoutClick = () => setShowLogoutAlert(true);

    const confirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("fullName");
        setUser(null);
        setIsLoggedIn(false);
        setShowLogoutAlert(false);
        navigate("/login");
    };

    const dismissLogout = () => setShowLogoutAlert(false);

    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200 min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0}}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-10"
            >
                <h3 className="text-3xl font-extrabold text-custom-dark-blue text-center drop-shadow-sm mb-6">
                    Už ste prihlásený!
                </h3>

                <p className="text-center text-gray-600 mb-8 text-fontSize16">
                    Vyzerá to, že ste už prihlásený. Čo chcete spraviť ďalej?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo("/")}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-custom-dark-blue text-white font-semibold rounded-2xl hover:bg-custom-dark-blue-hover transition-all"
                    >
                        <FiHome className="text-xl" /> Domov
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo("/profile")}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-custom-dark-blue text-white font-semibold rounded-2xl hover:bg-custom-dark-blue-hover transition-all"
                    >
                        <FiUser className="text-xl" /> Profil
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogoutClick}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition-all"
                    >
                        <FiLogOut className="text-xl" /> Odhlásiť sa
                    </motion.button>
                </div>
            </motion.div>

            {showLogoutAlert && (
                <LogOutAlert onConfirm={confirmLogout} onDismiss={dismissLogout} />
            )}
        </section>
    );
}
