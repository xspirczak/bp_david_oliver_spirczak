import { useState} from "react";
import { IoSendOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword({ setForgotPassword}) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        
        try {

            // fetch("http://localhost:3000/api/auth/forgot-password",
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Chyba pri odosielaní e-mailu. Skúste to znovu.");
            }

            setMessage("Overovací kód bol odoslaný na váš email.");

            setTimeout(() => {
                setForgotPassword("codeSent");
                navigate("/verifyCode", { state: { email } });
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
                        <p className="font-semibold text-center text-custom-dark-blue text-fontSize20">Zadajte váš email.</p>
                        <form onSubmit={handleSubmit} className="flex justify-center items-center gap-2 my-6">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:outline-custom-dark-blue focus:ring-custom-dark-blue-hover focus:border-custom-dark-blue block w-full md:w-1/2 lg:w-1/3 p-2.5"
                                placeholder="meno@domena.sk"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="flex items-center gap-2 md:text-fontSize16 text-fontSize12 font-semibold border border-gray-200 rounded-3xl py-2 px-3"
                            >
                                <IoSendOutline />
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
