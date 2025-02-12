import { useState } from "react";
import {MdDone} from "react-icons/md";
import {NavLink} from "react-router-dom";

export default function VerifyCodeForm({ email, firstName, lastName, password, role, setShowVerification,  setPasswordMatch, setSuccess, formnData, setRegistrationDone }) {
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);
    const [success, setVerificationSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, verificationCode: code, firstName, lastName, password, role }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
                return;
            }
            setRegistrationDone(true);
            setVerificationSuccess("Email bol verifikovaný! Registrácia je úspešná.");
        } catch (err) {
            setError("Server error.");
        }
    };

    const handleBackToRegistration = () => {
        setShowVerification(false);
        setPasswordMatch(false);
        setSuccess(null);
        formnData.firstName = '';
        formnData.lastName = '';
    }


    return (
        !success ? (
            <div>
                <h2 className="text-center md:text-fontSize20 text-fontSize16 text-custom-dark-blue"> Vložte verifikačný kód, ktorý
                    bol zaslaný na emailovú adresu:</h2>
                <p className="font-bold text-center text-custom-dark-blue md:text-fontSize16 text-fontSize16 mb-6 break-all">{email}</p>
                <form onSubmit={handleSubmit} className="lg:flex grid justify-center gap-6">
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Vložte kód"
                           className="border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue focus:ring-custom-dark-blue-hover focus:border-custom-dark-blue block lg:w-1/3 w-full p-2.5"
                           required/>
                    <button type="submit"
                            className="w-full lg:w-1/3 text-white text-fontSize16 font-semibold leading-6 hover:bg-custom-dark-blue-hover bg-custom-dark-blue focus:outline-none rounded-3xl py-1.5 text-center">Verifikovať
                    </button>
                </form>
                {error ? (
                    <p className="text-center text-red-500 text-fontSize20 my-3">{error}</p>
                ) : (
                    <p className="text-center text-red-500 text-fontSize20 invisible my-3">Error placeholder</p>
                )}
                <p className="text-center">V prípade, že Vám email neprišiel alebo ste zadali zlý email môžete <button
                    onClick={handleBackToRegistration} className="underline font-semibold">registráciu skúsiť
                    znova.</button></p>
            </div>
        ) : (
            <>
                <div className="flex justify-center mb-3">
                    <div className="rounded-full bg-green-400 w-10 h-10 text-center flex items-center justify-center">
                        <MdDone/>
                    </div>
                </div>
                <p className="text-center text-custom-dark-blue text-fontSize20 mb-6">Úspešne ste overili svoju emailovú
                    adresu.</p>
                <div className="flex justify-center">
                    <button
                        className="w-full lg:w-1/3 text-white text-fontSize16 font-semibold leading-6 hover:bg-custom-dark-blue-hover bg-custom-dark-blue focus:outline-none rounded-3xl py-1.5 text-center"><NavLink to="/login" className="text-white text-fontSize16 ">
                        Prihlásiť sa
                    </NavLink>
                    </button>
                </div>
            </>
        )
    );
}