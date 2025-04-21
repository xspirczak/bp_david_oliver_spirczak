import { IoSendOutline } from "react-icons/io5";
import { useState} from "react";
import {useNavigate, useLocation, Navigate} from "react-router-dom";

export default function VerifyCodeForgottenPassword({forgotPassword, setForgotPassword}) {
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || ""; // Retrieve email from previous page

    const handleSubmit = async (e) => {
        e.preventDefault();


        setError("");
        setMessage("");


        if (!email) {
            setError("Email nie je zadaný.");
            return;
        }

        if (!verificationCode) {
            setError("Verifikačný kód nie je zadaný.")
        }

        try {

            // fetch("http://localhost:3000/api/auth/forgot-password-verify-code",
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password-verify-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, verificationCode }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Chyba pri overovaní kódu. Skúste to znovu.");
            }

            setMessage("Overenie verifikačného kódu bolo úspešné!");


            localStorage.setItem("resetToken", data.token);

            setError(null);

            setTimeout(() => {
                setForgotPassword("codeVerified");
                navigate("/resetPassword", { state: { email } });
            }, 2000);

        } catch (err) {
            setError(err.message);
        }
    };

    if (forgotPassword !== "codeSent") {
        return <Navigate to={'/forgotPassword'} />;
    }



    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen h-screen lg:py-0">
                <div className="bg-white md:rounded-91 rounded-3xl shadow xl:w-5/12 w-5/6 flex justify-center p-6">
                    <div className="w-full">
                        <h1 className="lg:text-fontSize61 text-fontSize32 font-bold text-custom-dark-blue text-center">
                            Resetovanie hesla
                        </h1>
                        <p className="font-semibold text-center text-custom-dark-blue text-fontSize20">Zadajte verifikačný kód, ktorý prišiel na Vašu emailovú adresu.
                            email.</p>
                        <form onSubmit={handleSubmit} className="flex justify-center items-center gap-2 my-6">
                            <input
                                type="text"
                                name="verificationCode"
                                id="verificationCode"
                                className="border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue focus:ring-custom-dark-blue-hover focus:border-custom-dark-blue block w-full md:w-1/2 lg:w-1/3 p-2.5"
                                placeholder="Zadajte kód"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3"
                            >
                                <IoSendOutline/>
                            </button>
                        </form>
                        {error  ? (
                            <p className="text-red-500 text-center text-fontSize16 font-bold">{error}</p>
                        ) : message ? (
                            <p className="text-green-500 text-center text-fontSize16 font-bold">{message}</p>
                        ) : (
                            <p className="text-green-500 invisible text-center text-fontSize16 font-bold">Placeholder</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
