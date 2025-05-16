import { useEffect, useState } from 'react';
import ScrollLink from "./ScrollLink.jsx";

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 w-full bg-gradient-to-r from-blue-500 to-cyan-200 text-white text-sm px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3 z-50 shadow-lg">
            <p className="text-center md:text-left">
                Táto stránka používa úložisko pre personalizáciu a správne fungovanie. Viac sa dozviete v našich{' '}
                <ScrollLink to="/privacy" className="underline hover:text-gray-300">zásadách ochrany osobných údajov</ScrollLink>.
            </p>
            <button
                className="bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white px-4 py-2 rounded-3xl transition"
                onClick={acceptCookies}
            >
                Rozumiem
            </button>
        </div>
    );
}
