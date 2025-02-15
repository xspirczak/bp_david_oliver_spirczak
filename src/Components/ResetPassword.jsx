import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || ""; // Retrieve email from previous step

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        console.log(newPassword, confirmPassword)
        if (newPassword !== confirmPassword) {
            setError("Heslá sa nezhodujú.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Chyba pri zmene hesla. Skúste to znovu.");
            }

            setMessage("Heslo bolo úspešne zmenené!");
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen h-screen lg:py-0">
                <div className="bg-white md:rounded-91 rounded-3xl shadow w-5/6 sm:w-2/3 flex justify-center p-6">
                    <div className="w-full">
                        <h1 className="lg:text-fontSize61 text-fontSize32 font-bold text-custom-dark-blue text-center">
                            Resetovanie hesla
                        </h1>
                        <p className="font-semibold text-center text-custom-dark-blue text-fontSize20">Zadajte Váše
                            nové heslo a opätovne ho potvrďte.</p>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center justify-center my-6">
                            <input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                className="border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue focus:ring-custom-dark-blue-hover focus:border-custom-dark-blue block w-full md:w-1/2 lg:w-1/3 p-2.5"
                                placeholder="Nové heslo"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue focus:ring-custom-dark-blue-hover focus:border-custom-dark-blue block w-full md:w-1/2 lg:w-1/3 p-2.5"
                                placeholder="Potvrďte nové heslo"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white font-bold py-2 px-4 rounded-3xl w-full md:w-1/2 lg:w-1/3 mt-3"
                            >
                                Zmeniť heslo
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
