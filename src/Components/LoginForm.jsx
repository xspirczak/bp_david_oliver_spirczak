import {NavLink, useNavigate} from "react-router-dom";
import {useRef, useState} from "react";
import LoginSuccess from "./LoginSuccess.jsx";
import AlreadyLoggedIn from "./AlreadyLoggedIn.jsx";

export default function LoginForm({ isLoggedIn, setIsLoggedIn, setUser, validateEmail, decodeJWT }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
    const [fullName, setFullName] = useState("");
    const navigate = useNavigate();

    const relocateRef = useRef(null);

    function togglePasswordVisibility() {
        let e = document.getElementById("password")

        if (e.type === "password") {
            e.type = "text"
            e.placeholder = "vaše heslo"
        } else {
            e.type = "password"
            e.placeholder = "••••••••"
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email && !password) {
            setError('Zadajte prihlasovacie údaje');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Prihlásenie zlyhaLo.');

            localStorage.setItem('token', data.token); // Save token for session

            setIsLoggedIn(true);

            const decoded = decodeJWT(data.token)

            setFullName(data.user.firstName + ' ' + data.user.lastName);

            setUser(decoded.email);

            fetch('http://localhost:3000/api/protected', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => console.log("Protected Route Response:", data))
                .catch(err => console.error('Fetch error:', err));


            setIsLoginSuccessful(true);
/*
            relocateRef.current = setTimeout(() => {
                setIsLoginSuccessful(false);
                navigate('/');
            }, 3000);
            */

        } catch (err) {
            setError(err.message);
        }
    };

    const navigateTo = (route) => {
        if (relocateRef.current) {
            clearTimeout(relocateRef.current);
        }
        navigate(route);
    };


    return (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-200">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen h-screen lg:py-0">
                <div className="bg-white md:rounded-91 rounded-3xl shadow w-5/6 sm:w-2/3 flex justify-center">
                    {!isLoginSuccessful && !isLoggedIn ? (
                    <div className="w-5/6 sm:w-2/3 lg:w-3/5 sm:p-6 p-0 sm:py-28 py-10">
                        <h1 className="lg:text-fontSize61 text-fontSize32 font-bold leading-tight tracking-tight text-custom-dark-blue text-center">
                            Prihlásiť sa
                        </h1>
                        <p className="text-fontSize16 font-light text-gray-500 text-center mb-10">
                            Nemáte učet?  <NavLink to="/register" className="font-medium text-primary-600 hover:underline">
                            Registrujte sa
                        </NavLink>
                        </p>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Email<span className="text-red-400 ml-1">*</span></label>
                                <div className="relative">
                                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="absolute top-4 left-3"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M0 2.08696C0 0.934358 0.95939 0 2.14286 0H17.8571C19.0406 0 20 0.934358 20 2.08696V2.56271L10.5477 8.70094C10.4144 8.78442 10.2209 8.84401 9.99999 8.84401C9.7791 8.84401 9.58559 8.78442 9.45227 8.70094L0 2.56273V2.08696ZM0 4.65301V13.913C0 15.0656 0.95939 16 2.14286 16H17.8571C19.0406 16 20 15.0656 20 13.913V4.65299L11.5334 10.1511L11.5252 10.1565C11.0757 10.4414 10.5359 10.5831 9.99999 10.5831C9.46409 10.5831 8.92431 10.4414 8.47481 10.1564L8.46653 10.1512L0 4.65301Z"
                                              fill="black"/>
                                    </svg>
                                    <input type="email" name="email" id="email" autoComplete={email}
                                           className="border border-custom-dark-blue text-custom-dark-blue pl-10 rounded-3xl focus:outline-custom-dark-blue focus:ring-custom-dark-blue-hover focus:border-custom-dark-blue block w-full p-2.5"
                                               placeholder="meno@domena.sk"
                                           onChange={(e) => {setEmail(e.target.value)
                                                                        validateEmail(e.target.value, "email")
                                                                        setError(null)}}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-center">
                                    <label htmlFor="password"
                                           className="block mb-2 text-fontSize16 text-custom-dark-blue text-center">Heslo<span className="text-red-400 ml-1">*</span></label>
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
                                    <button type="button" className="absolute top-4 right-4"
                                            onClick={togglePasswordVisibility}>
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
                                    {password ? (
                                    <input type="password" name="password" id="password" placeholder="••••••••"
                                           className="border border-green-400 text-custom-dark-blue pl-11 pr-10 rounded-3xl focus:outline-custom-dark-blue focus:border-custom-dark-blue focus:ring-custom-dark-blue-hover block w-full p-2.5"
                                           required=""
                                           onChange={(e) => {setPassword(e.target.value)
                                                                                            setError(null)}}
                                    />
                                    ) : (<input type="password" name="password" id="password" placeholder="••••••••" autoComplete={password}
                                                className="border border-custom-dark-blue text-custom-dark-blue pl-11 pr-10 rounded-3xl focus:outline-custom-dark-blue focus:border-custom-dark-blue focus:ring-custom-dark-blue-hover block w-full p-2.5"
                                                required=""
                                                onChange={(e) => {
                                                    setPassword(e.target.value)
                                                    setError(null)
                                                }}
                                    />)}

                                </div>

                                <div className="flex items-center justify-end">
                                    <a href="#"
                                       className="text-fontSize16 text-custom-dark-blue hover:underline">Zabudol som
                                        heslo</a>
                                </div>
                            </div>
                            <button type="submit"
                                    className="w-full text-white text-fontSize16 font-semibold leading-6 hover:bg-custom-dark-blue-hover bg-custom-dark-blue focus:outline-none rounded-3xl px-5 py-1.5 text-center">Prihlásiť sa
                            </button>
                            {error ? ( <p className="text-red-500 text-center text-fontSize20">{error}</p>
                            ) : (
                                <p className="text-center text-fontSize20 invisible">Error placeholder</p>
                            )
                            }
                        </form>
                    </div>
                    ) : isLoginSuccessful ? (
                        <LoginSuccess navigateTo={navigateTo} fullName={fullName}></LoginSuccess>
                    ) : isLoggedIn ? (
                        <AlreadyLoggedIn navigateTo={navigateTo} setIsLoggedIn={setIsLoggedIn} setUser={setUser}></AlreadyLoggedIn>
                    ) : (<></>)}
                </div>
            </div>
        </section>
    )
}