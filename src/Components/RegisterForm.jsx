import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import VerifyCodeForm from "./VerifyCodeForm.jsx";

export default function RegisterForm({ validateEmail, validEmail }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        newPasswordRepeat: "",
        role: "user",
    });
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [registrationDone, setRegistrationDone] = useState(false);

    const togglePasswordVisibility = (inputId) => {
        let e = document.getElementById(inputId);

        if (e.type === "password") {
            e.type = "text"
            e.placeholder = "password"
        } else {
            e.type = "password"
            e.placeholder = "••••••••"
        }
    };

    const handleChange = (e) => {
        console.log(`Name: ${e.target.name}, Value: ${e.target.value}`); // Debugging log

        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (formData.password === "" || formData.newPasswordRepeat === "") {
            setPasswordMatch(false);
        } else {
            setPasswordMatch(formData.password === formData.newPasswordRepeat);
        }
    }, [formData.password, formData.newPasswordRepeat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);


        if (!formData.firstName || !formData.lastName) {
            setError('Vstup pre meno je prázdny.');
            return;
        }

        if (!passwordMatch) {
            setError('Heslá sa musia zhodovať.');
            return;
        }

        if (!validEmail) {
            setError('Zlý tvar emailu. (meno@domena.sk)');
            return;
        }

        try {
            //console.log(JSON.stringify(formData.password + " " + formData.newPasswordRepeat));

            //console.log(formData)

            // fetch("http://localhost:3000/api/auth/register",

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Neznáma chyba pri registrácii.");
                return;
            }

            setSuccess("Registrácia bola úspešná!");
            setShowVerification(true);
            //setFormData({ firstName: "", lastName: "", email: "", password: "",newPasswordRepeat: "", role: "user" });
        } catch (err) {
            setError(err.message);
        }
    };


    return (

        <section className="bg-gradient-to-r from-blue-500 to-cyan-200 py-10">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0 my-6">
                <div className="bg-white md:rounded-91 rounded-3xl shadow w-5/6 sm:w-2/3 flex justify-center">
                    <div className="w-5/6 sm:w-2/3 lg:w-3/5 sm:p-6 p-0 sm:py-28 py-10">
                        { !registrationDone ? (
                            <>
                                <h1 className="lg:text-fontSize61 text-fontSize32 font-bold leading-tight tracking-tight text-custom-dark-blue text-center">
                                    Registrovať sa
                                </h1>
                                <p className="text-fontSize16 font-light text-gray-500 text-center mb-10">
                                    Máte účet? <NavLink to="/login" className="font-medium text-primary-600 hover:underline">
                                         Prihláste sa
                                    </NavLink>
                                </p>
                            </>
                            ) : (
                                <></>
                            )}
                        {!showVerification ? (
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email"
                                       className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Email<span className="text-red-400 ml-1">*</span></label>
                                <div className="relative">
                                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none"
                                         className="absolute top-4 left-3"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M0 2.08696C0 0.934358 0.95939 0 2.14286 0H17.8571C19.0406 0 20 0.934358 20 2.08696V2.56271L10.5477 8.70094C10.4144 8.78442 10.2209 8.84401 9.99999 8.84401C9.7791 8.84401 9.58559 8.78442 9.45227 8.70094L0 2.56273V2.08696ZM0 4.65301V13.913C0 15.0656 0.95939 16 2.14286 16H17.8571C19.0406 16 20 15.0656 20 13.913V4.65299L11.5334 10.1511L11.5252 10.1565C11.0757 10.4414 10.5359 10.5831 9.99999 10.5831C9.46409 10.5831 8.92431 10.4414 8.47481 10.1564L8.46653 10.1512L0 4.65301Z"
                                              fill="black"/>
                                    </svg>
                                    <input type="email" name="email" id="email" autoComplete={"email"}
                                           className="border border-custom-dark-blue text-custom-dark-blue pl-10 rounded-3xl focus:ring-primary-600 focus:outline-custom-dark-blue focus:border-primary-600 block w-full p-2.5"
                                           placeholder="name@company.com" required="" onChange={(e) => {handleChange(e)
                                        validateEmail(e.target.value, "email")
                                        setError(null)}}/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="firstName"
                                       className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Krstné meno<span className="text-red-400 ml-1">*</span></label>
                                <div className="relative">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         className="absolute top-3 left-3"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM4 20V17.2C4 16.6333 4.14583 16.1125 4.4375 15.6375C4.72917 15.1625 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.6458 8.75 13.3875C9.81667 13.1292 10.9 13 12 13C13.1 13 14.1833 13.1292 15.25 13.3875C16.3167 13.6458 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2708 15.1625 19.5625 15.6375C19.8542 16.1125 20 16.6333 20 17.2V20H4ZM6 18H18V17.2C18 17.0167 17.9542 16.85 17.8625 16.7C17.7708 16.55 17.65 16.4333 17.5 16.35C16.6 15.9 15.6917 15.5625 14.775 15.3375C13.8583 15.1125 12.9333 15 12 15C11.0667 15 10.1417 15.1125 9.225 15.3375C8.30833 15.5625 7.4 15.9 6.5 16.35C6.35 16.4333 6.22917 16.55 6.1375 16.7C6.04583 16.85 6 17.0167 6 17.2V18ZM12 10C12.55 10 13.0208 9.80417 13.4125 9.4125C13.8042 9.02083 14 8.55 14 8C14 7.45 13.8042 6.97917 13.4125 6.5875C13.0208 6.19583 12.55 6 12 6C11.45 6 10.9792 6.19583 10.5875 6.5875C10.1958 6.97917 10 7.45 10 8C10 8.55 10.1958 9.02083 10.5875 9.4125C10.9792 9.80417 11.45 10 12 10Z"
                                            fill="#1D1B20"/>
                                    </svg>

                                    {formData.firstName ? (
                                    <input type="text" name="firstName" id="fistName" autoComplete={"username"}
                                           className="border border-green-400 text-custom-dark-blue pl-10 rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-custom-dark-blue"
                                           placeholder="Jozef" required="" onChange={handleChange}/>
                                    ) : (
                                        <input type="text" name="firstName" id="fistName" autoComplete={"username"}
                                               className="border border-custom-dark-blue text-custom-dark-blue pl-10 rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-custom-dark-blue"
                                               placeholder="Jozef" required="" onChange={handleChange}/>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="lastName"
                                       className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Priezvisko<span
                                    className="text-red-400 ml-1">*</span></label>
                                <div className="relative">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         className="absolute top-3 left-3"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM4 20V17.2C4 16.6333 4.14583 16.1125 4.4375 15.6375C4.72917 15.1625 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.6458 8.75 13.3875C9.81667 13.1292 10.9 13 12 13C13.1 13 14.1833 13.1292 15.25 13.3875C16.3167 13.6458 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2708 15.1625 19.5625 15.6375C19.8542 16.1125 20 16.6333 20 17.2V20H4ZM6 18H18V17.2C18 17.0167 17.9542 16.85 17.8625 16.7C17.7708 16.55 17.65 16.4333 17.5 16.35C16.6 15.9 15.6917 15.5625 14.775 15.3375C13.8583 15.1125 12.9333 15 12 15C11.0667 15 10.1417 15.1125 9.225 15.3375C8.30833 15.5625 7.4 15.9 6.5 16.35C6.35 16.4333 6.22917 16.55 6.1375 16.7C6.04583 16.85 6 17.0167 6 17.2V18ZM12 10C12.55 10 13.0208 9.80417 13.4125 9.4125C13.8042 9.02083 14 8.55 14 8C14 7.45 13.8042 6.97917 13.4125 6.5875C13.0208 6.19583 12.55 6 12 6C11.45 6 10.9792 6.19583 10.5875 6.5875C10.1958 6.97917 10 7.45 10 8C10 8.55 10.1958 9.02083 10.5875 9.4125C10.9792 9.80417 11.45 10 12 10Z"
                                            fill="#1D1B20"/>
                                    </svg>

                                    {formData.lastName ? (
                                    <input type="text" name="lastName" id="lastName" autoComplete={"username"}
                                           className="border border-green-400 text-custom-dark-blue pl-10 rounded-3xl focus:ring-primary-600 focus:outline-custom-dark-blue focus:border-primary-600 block w-full p-2.5"
                                           placeholder="Horvát" required="" onChange={handleChange}/>
                                    ) : (
                                        <input type="text" name="lastName" id="lastName" autoComplete={"username"}
                                               className="border border-custom-dark-blue text-custom-dark-blue pl-10 rounded-3xl focus:ring-primary-600 focus:outline-custom-dark-blue focus:border-primary-600 block w-full p-2.5"
                                               placeholder="Horvát" required="" onChange={handleChange}/>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-center">
                                    <label htmlFor="password"
                                           className="block mb-2 text-fontSize16 text-custom-dark-blue text-center">Heslo<span
                                        className="text-red-400 ml-1">*</span></label>
                                </div>
                                <div className="relative">
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                         className="absolute top-2.5 left-3"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.33335 14.5833C7.18276 14.5833 6.25 13.6506 6.25 12.5C6.25 11.3493 7.18276 10.4166 8.33335 10.4166C9.48394 10.4166 10.4167 11.3493 10.4167 12.5C10.4167 13.6506 9.48394 14.5833 8.33335 14.5833Z"
                                            fill="black"/>
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M0 12.5C0 22.7937 2.20625 25 12.5 25C22.7937 25 25 22.7937 25 12.5C25 2.20625 22.7937 0 12.5 0C2.20625 0 0 2.20625 0 12.5ZM8.33335 16.6667C6.03218 16.6667 4.1667 14.8011 4.1667 12.5C4.1667 10.1988 6.03218 8.33335 8.33335 8.33335C10.2777 8.33335 11.911 9.66514 12.3708 11.4663C12.4131 11.461 12.4563 11.4584 12.5 11.4584H19.7917C20.3669 11.4584 20.8333 11.9247 20.8333 12.5V15.625C20.8333 16.2003 20.3669 16.6667 19.7917 16.6667C19.2164 16.6667 18.75 16.2003 18.75 15.625V13.5417H16.6667V14.5833C16.6667 15.1586 16.2003 15.625 15.625 15.625C15.0497 15.625 14.5833 15.1586 14.5833 14.5833V13.5417H12.5C12.4563 13.5417 12.4131 13.539 12.3708 13.5337C11.911 15.3349 10.2777 16.6667 8.33335 16.6667Z"
                                              fill="black"/>
                                    </svg>
                                    <button type="button" id="btnNewPassword" className="absolute top-4 right-4"
                                            onClick={() => togglePasswordVisibility("password")}>
                                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M13.0617 0.65257L12.4952 0.100466C12.3351 -0.0555688 12.0395 -0.0315556 11.8547 0.184461L9.88396 2.09294C8.99712 1.72089 8.02422 1.54084 7.00191 1.54084C3.95966 1.55279 1.32412 3.28123 0.0554398 5.76605C-0.0184799 5.92208 -0.0184799 6.11408 0.0554398 6.24611C0.646576 7.42244 1.53341 8.39472 2.64189 9.12687L1.02845 10.7233C0.843701 10.9033 0.819061 11.1914 0.94226 11.3474L1.50877 11.8995C1.66888 12.0556 1.96446 12.0316 2.14921 11.8155L12.963 1.27682C13.197 1.09687 13.2218 0.80862 13.0617 0.65257ZM7.65467 4.27745C7.44529 4.22942 7.22363 4.16944 7.01424 4.16944C5.9673 4.16944 5.12987 4.98567 5.12987 6.00588C5.12987 6.20994 5.17915 6.42596 5.2407 6.63003L4.41541 7.42226C4.16912 7.00219 4.03365 6.53398 4.03365 6.0059C4.03365 4.4095 5.35152 3.12514 6.98959 3.12514C7.53156 3.12514 8.01187 3.25716 8.44291 3.49719L7.65467 4.27745Z"
                                                fill="black" fillOpacity="0.8"/>
                                            <path
                                                d="M13.9485 5.76601C13.5174 4.92575 12.9508 4.1696 12.2488 3.55741L9.95796 5.76601V6.00604C9.95796 7.60244 8.64008 8.8868 7.00201 8.8868H6.75572L5.30239 10.3032C5.84436 10.4112 6.41087 10.4832 6.96511 10.4832C10.0074 10.4832 12.6429 8.75477 13.9116 6.258C14.0224 6.08991 14.0224 5.92206 13.9485 5.76601Z"
                                                fill="black" fillOpacity="0.8"/>
                                        </svg>
                                    </button>
                                    {passwordMatch ? (
                                    <input type="password" name="password" id="password" placeholder="••••••••" autoComplete={"new-password"}
                                           className="border border-green-400 text-custom-dark-blue pl-11 pr-10 rounded-3xl focus:outline-custom-dark-blue focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                           required="" onChange={handleChange}/>
                                    ) : (
                                        <input type="password" name="password" id="password" placeholder="••••••••"
                                               autoComplete={"new-password"}
                                               className="border border-custom-dark-blue text-custom-dark-blue pl-11 pr-10 rounded-3xl focus:outline-custom-dark-blue focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                               required="" onChange={handleChange}/>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-center">
                                    <label htmlFor="newPasswordRepeat"
                                           className="block mb-2 text-fontSize16 text-custom-dark-blue text-center">Opakované
                                        heslo<span className="text-red-400 ml-1">*</span></label>
                                </div>
                                <div className="relative">
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                         className="absolute top-2.5 left-3"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.33335 14.5833C7.18276 14.5833 6.25 13.6506 6.25 12.5C6.25 11.3493 7.18276 10.4166 8.33335 10.4166C9.48394 10.4166 10.4167 11.3493 10.4167 12.5C10.4167 13.6506 9.48394 14.5833 8.33335 14.5833Z"
                                            fill="black"/>
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M0 12.5C0 22.7937 2.20625 25 12.5 25C22.7937 25 25 22.7937 25 12.5C25 2.20625 22.7937 0 12.5 0C2.20625 0 0 2.20625 0 12.5ZM8.33335 16.6667C6.03218 16.6667 4.1667 14.8011 4.1667 12.5C4.1667 10.1988 6.03218 8.33335 8.33335 8.33335C10.2777 8.33335 11.911 9.66514 12.3708 11.4663C12.4131 11.461 12.4563 11.4584 12.5 11.4584H19.7917C20.3669 11.4584 20.8333 11.9247 20.8333 12.5V15.625C20.8333 16.2003 20.3669 16.6667 19.7917 16.6667C19.2164 16.6667 18.75 16.2003 18.75 15.625V13.5417H16.6667V14.5833C16.6667 15.1586 16.2003 15.625 15.625 15.625C15.0497 15.625 14.5833 15.1586 14.5833 14.5833V13.5417H12.5C12.4563 13.5417 12.4131 13.539 12.3708 13.5337C11.911 15.3349 10.2777 16.6667 8.33335 16.6667Z"
                                              fill="black"/>
                                    </svg>
                                    <button type="button" id="btnNewPasswordRepeat" className="absolute top-4 right-4"
                                            onClick={() => togglePasswordVisibility("newPasswordRepeat")}>
                                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M13.0617 0.65257L12.4952 0.100466C12.3351 -0.0555688 12.0395 -0.0315556 11.8547 0.184461L9.88396 2.09294C8.99712 1.72089 8.02422 1.54084 7.00191 1.54084C3.95966 1.55279 1.32412 3.28123 0.0554398 5.76605C-0.0184799 5.92208 -0.0184799 6.11408 0.0554398 6.24611C0.646576 7.42244 1.53341 8.39472 2.64189 9.12687L1.02845 10.7233C0.843701 10.9033 0.819061 11.1914 0.94226 11.3474L1.50877 11.8995C1.66888 12.0556 1.96446 12.0316 2.14921 11.8155L12.963 1.27682C13.197 1.09687 13.2218 0.80862 13.0617 0.65257ZM7.65467 4.27745C7.44529 4.22942 7.22363 4.16944 7.01424 4.16944C5.9673 4.16944 5.12987 4.98567 5.12987 6.00588C5.12987 6.20994 5.17915 6.42596 5.2407 6.63003L4.41541 7.42226C4.16912 7.00219 4.03365 6.53398 4.03365 6.0059C4.03365 4.4095 5.35152 3.12514 6.98959 3.12514C7.53156 3.12514 8.01187 3.25716 8.44291 3.49719L7.65467 4.27745Z"
                                                fill="black" fillOpacity="0.8"/>
                                            <path
                                                d="M13.9485 5.76601C13.5174 4.92575 12.9508 4.1696 12.2488 3.55741L9.95796 5.76601V6.00604C9.95796 7.60244 8.64008 8.8868 7.00201 8.8868H6.75572L5.30239 10.3032C5.84436 10.4112 6.41087 10.4832 6.96511 10.4832C10.0074 10.4832 12.6429 8.75477 13.9116 6.258C14.0224 6.08991 14.0224 5.92206 13.9485 5.76601Z"
                                                fill="black" fillOpacity="0.8"/>
                                        </svg>
                                    </button>
                                    {passwordMatch ? (
                                    <input type="password" name="newPasswordRepeat" id="newPasswordRepeat" autoComplete={"new-password"}
                                           placeholder="••••••••"
                                           className="border border-green-400 text-custom-dark-blue pl-11 pr-10 rounded-3xl focus:outline-custom-dark-blue focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                           required="" onChange={handleChange}/>
                                    ) : (
                                        <input type="password" name="newPasswordRepeat" id="newPasswordRepeat"
                                               autoComplete={"new-password"}
                                               placeholder="••••••••"
                                               className="border border-custom-dark-blue text-custom-dark-blue pl-11 pr-10 rounded-3xl focus:outline-custom-dark-blue focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                               required="" onChange={handleChange}/>
                                    )}
                                </div>

                                {error || success ? (
                                    <div className="flex justify-center mt-5 text-red-500">
                                        {error && <p className="text-red-5+00 text-center text-fontSize20">{error}</p>}
                                        {success && <p className="text-green-500 text-center text-fontSize20">{success}</p>}
                                    </div>

                                ) : (
                                    <div className="flex justify-center mt-5 text-red-500 invisible">
                                        <p className="text-red-500 text-center text-fontSize20">Final state placeholder</p>
                                    </div>
                                )}
                            </div>

                            <button type="submit"
                                    className="w-full text-white text-fontSize16 font-semibold leading-6 hover:bg-custom-dark-blue-hover bg-custom-dark-blue focus:outline-none rounded-3xl px-5 py-1.5 text-center">Registrovať sa
                            </button>

                        </form>
                        ) : (
                            <VerifyCodeForm setRegistrationDone={setRegistrationDone} formnData={formData} setShowVerification={setShowVerification} setPasswordMatch={setPasswordMatch} setSuccess={setSuccess} email={formData.email} firstName={formData.firstName} lastName={formData.lastName} password={formData.password} role={formData.role} />
                        )}
                    </div>
                </div>
            </div>
        </section>

    )
}
