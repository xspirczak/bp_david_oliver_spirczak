import { useState } from 'react';
import {FaBug, FaCheck, FaCheckCircle, FaUndo} from 'react-icons/fa';
import {isStrongPassword, togglePasswordVisibility} from "../../utils/functions.js";
import Joyride from 'react-joyride';

export function DemoRegistration({setProgress, progress, setStep}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(false);

    const [run, setRun] = useState(true);
    const steps = [
        {
            target: 'input#email',
            content: 'Zadajte platný e-mail. Napríklad demo@email.com',
        },
        {
            target: 'input#password',
            content: 'Heslo musí mať aspoň 6 znakov, jedno veľké a malé písmeno, číslo a špeciálny znak.'
        },
        {
            target: 'input#newPasswordRepeat',
            content: 'Zopakujte heslo pre overenie.',
        },
        {
            target: 'button[type="submit"]',
            content: 'Kliknite na tlačidlo pre odoslanie registrácie.',
        }
    ];

    const validData = {
        "email" : "demo@email.com",
        "password" : "Test123@",
        "passwordRepeat" : "Test123@"
    }

    const invalidData = {
        "email" : "demoemail.c",
        "password" : "123",
        "passwordRepeat" : "0123"
    }


    const validate = () => {
        const errs = [];

        if (!email || !password || !passwordRepeat) {
            errs.push("Všetky polia sú povinné.");
        }

        if (password !== passwordRepeat) {
            errs.push("Heslá sa nezhodujú.");
        }

        const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

        if (!isValidEmail.test(email)) {
            errs.push("Neplatný formát emailu. Email musí obsahovať '@' a doménu.");
        }

        const passwordCheck = isStrongPassword(password);
        if (!passwordCheck.strong) {
            errs.push(passwordCheck.error);
        }

        const users = JSON.parse(localStorage.getItem('demoUsers')) || [];
        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            errs.push("Používateľ s týmto emailom už existuje.");
        }

        if (errs.length === 0) {
            const updatedUsers = [...users, { email, password }];
            localStorage.setItem('demoUsers', JSON.stringify(updatedUsers));
            setSuccess(true);
            setErrors([]);
            setProgress(prev => {
                const updated = {
                    ...prev,
                    register: 'completed',
                    login: prev.login === 'locked' ? 'unlocked' : prev.login
                };
                localStorage.setItem('tutorialProgress', JSON.stringify(updated));
                return updated;
            });
        } else {
            setSuccess(false);
            setErrors(errs);
        }
    };


    const useDemoData = (type) => {
        if (type === 'valid') {
            setEmail(validData.email);
            setPassword(validData.password);
            setPasswordRepeat(validData.passwordRepeat);
        } else if (type === 'invalid') {
            setEmail(invalidData.email);
            setPassword(invalidData.password);
            setPasswordRepeat(invalidData.passwordRepeat);
        }
        setErrors([]);
        setSuccess(false);
    };

    const reset = () => {
        setEmail('');
        setPassword('');
        setPasswordRepeat('');
        setErrors([]);
        setSuccess(false);
    };

    return ( <>
        <Joyride
            steps={steps}
            run={run}
            continuous
            showSkipButton
            showProgress
            styles={{
                options: {
                    primaryColor: "#212D40",
                    zIndex: 10000
                }
            }}
            locale={{
                back: 'Späť',
                close: 'Zavrieť',
                last: 'Dokončiť',
                next: 'Ďalej',
                skip: 'Preskočiť',
                nextLabelWithProgress: 'Krok {step} z {steps}',
            }}
        />

        <div className="bg-white rounded-xl shadow-lg px-10 pb-10 space-y-6 max-w-screen-sm mx-auto">
            <h2 className="text-fontSize48 font-bold text-custom-dark-blue text-center">
                Demo Registrácia
            </h2>
            <p className="text-custom-dark-blue text-center font-light">
                Vyskúšajte si, ako funguje registrácia používateľa. Môžete použiť demo údaje alebo zadať vlastné.
            </p>
            <div className="bg-gray-200 rounded-3xl p-4 shadow-sm border border-custom-dark-blue-hover">
                <h3 className="text-lg font-bold text-custom-dark-blue mb-3">Požiadavky na registráciu:</h3>
                <ul className="space-y-2 text-custom-dark-blue">
                    <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-custom-dark-blue w-3 h-3 flex-shrink-0 mt-1.5"/>
                        <span>Emailová adresa musí obsahovať <span className="font-bold">@</span> a doménu pozostávajúcu aspoň z <span
                            className="font-bold">2 znakov</span>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-custom-dark-blue w-3 h-3 flex-shrink-0 mt-1.5"/>
                        <span>Heslo musí byť <span className="font-bold">dostatočne silné</span> – minimálne <span
                            className="font-bold">6 znakov</span>, aspoň <span className="font-bold">1 malé a veľké písmeno</span>, <span>špeciálny znak</span> a <span className="font-bold">číslo</span>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-custom-dark-blue w-3 h-3 flex-shrink-0 mt-1.5"/>
                        <span>Heslá sa musia <span className="font-bold">zhodovať</span>.</span>
                    </li>
                </ul>
            </div>

            <div className="mb-6 border-b border-gray-300 pb-2 text-center">
                <p className="text-custom-dark-blue text-fontSize20 font-semibold">Testovacie dáta:</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative group w-full sm:w-1/3 flex justify-center">
                    <button
                        onClick={() => useDemoData('valid')}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-3xl  flex items-center justify-center gap-2 w-2/3 sm:w-full border border-green-300"
                    >
                        <FaCheck/> Validné údaje
                    </button>
                    <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-green-200 text-green-900 text-sm px-3 py-1 rounded-xl shadow-lg opacity-0 sm:group-hover:opacity-100 transition-opacity z-10 whitespace-pre-line">
                        {
                            JSON.stringify(validData)
                                .replace(/"passwordRepeat":/g, '"Opakované heslo":')
                                .replace(/"email":/g, '"Email":')
                                .replace(/"password":/g, '"Heslo":')
                                .split(/["{}]/)
                                .join("")
                                .replace(/:/g, ": ")
                                .replace(/,/g, "\n")
                        } </div>
                </div>


                <div className="relative group w-full sm:w-1/3 flex justify-center">
                    <button
                        onClick={() => useDemoData('invalid')}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-3xl flex items-center justify-center gap-2 w-2/3 sm:w-full border border-red-300"
                    >
                        <FaBug/> Nevalidné údaje
                    </button>
                    <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-red-200 text-red-900 text-sm px-3 py-1 rounded-xl shadow-lg opacity-0 sm:group-hover:opacity-100 transition-opacity z-10 whitespace-pre-line"
                    >
                        {
                            JSON.stringify(invalidData)
                                .replace(/"passwordRepeat":/g, '"Opakované heslo":')
                                .replace(/"email":/g, '"Email":')
                                .replace(/"password":/g, '"Heslo":')
                                .split(/["{}]/)
                                .join("")
                                .replace(/:/g, ": ")
                                .replace(/,/g, "\n")
                        }
                    </div>

                </div>


                <div className="w-full sm:w-1/3 flex justify-center">
                    <button
                        onClick={reset}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-3xl  flex items-center justify-center gap-2 w-2/3 sm:w-full border border-gray-400"
                    >
                        <FaUndo/> Resetovať
                    </button>
                </div>
            </div>
            <p className="text-custom-dark-blue text-center font-light">
                Demo údaje sú len na ukážku a nemajú žiadny skutočný účel.
            </p>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    validate();
                }}
                className="space-y-6"
            >
                <div>
                    <label htmlFor="email"
                           className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Email<span
                        className="text-red-400 ml-1">*</span></label>
                    <div className="relative">
                        <svg width="20" height="16" viewBox="0 0 20 16" fill="none"
                             className="absolute top-4 left-3"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M0 2.08696C0 0.934358 0.95939 0 2.14286 0H17.8571C19.0406 0 20 0.934358 20 2.08696V2.56271L10.5477 8.70094C10.4144 8.78442 10.2209 8.84401 9.99999 8.84401C9.7791 8.84401 9.58559 8.78442 9.45227 8.70094L0 2.56273V2.08696ZM0 4.65301V13.913C0 15.0656 0.95939 16 2.14286 16H17.8571C19.0406 16 20 15.0656 20 13.913V4.65299L11.5334 10.1511L11.5252 10.1565C11.0757 10.4414 10.5359 10.5831 9.99999 10.5831C9.46409 10.5831 8.92431 10.4414 8.47481 10.1564L8.46653 10.1512L0 4.65301Z"
                                  fill="black"/>
                        </svg>
                        <input type="text" name="email" id="email" autoComplete={"email"} value={email}
                               className="border border-custom-dark-blue text-custom-dark-blue pl-10 rounded-3xl focus:ring-primary-600 focus:outline-custom-dark-blue focus:border-primary-600 block w-full p-2.5"
                               placeholder="meno@domena.com" required="" onChange={(e) => {
                            setEmail(e.target.value)
                            setErrors([]);
                            setSuccess(false);
                        }}/>
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
                        <input type="password" name="password" id="password" placeholder="••••••••" value={password}
                               autoComplete={"new-password"}
                               className="border border-custom-dark-blue text-custom-dark-blue pl-11 pr-10 rounded-3xl focus:outline-custom-dark-blue focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                               required="" onChange={(e) => {
                            setPassword(e.target.value)
                            setErrors([]);
                            setSuccess(false);
                        }}/>

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

                        <input type="password" name="newPasswordRepeat" id="newPasswordRepeat"
                               autoComplete={"new-password"} value={passwordRepeat}
                               placeholder="••••••••"
                               className="border border-custom-dark-blue text-custom-dark-blue pl-11 pr-10 rounded-3xl focus:outline-custom-dark-blue focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                               required="" onChange={(e) => {
                            setPasswordRepeat(e.target.value)
                            setErrors([]);
                            setSuccess(false);
                        }}/>

                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full text-white text-fontSize16 font-semibold leading-6 hover:bg-custom-dark-blue-hover bg-custom-dark-blue focus:outline-none rounded-3xl px-5 py-1.5 text-center"
                >
                    Demo registácia
                </button>
            </form>

            <div className="min-h-[5rem] transition-all">
                {errors.length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl">
                        <ul className="list-disc list-inside text-sm">
                            {errors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-xl text-sm">
                        Demo registrácia prebehla úspešne!
                    </div>
                )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-300">
                <button
                    onClick={() => setStep(null)}
                    className="flex items-center gap-2 px-5 py-2 text-custom-dark-blue border border-custom-dark-blue rounded-2xl hover:bg-custom-dark-blue hover:text-white transition-all duration-300"
                >
                    <FaUndo className="text-lg"/>
                    Späť na menu
                </button>
                <button
                    onClick={() => setStep('login')}
                    disabled={progress.register !== 'completed'}
                    className="flex items-center gap-2 px-5 py-2 bg-custom-dark-blue text-white rounded-2xl hover:bg-custom-dark-blue-hover transition-all duration-300 disabled:opacity-50"
                >
                    <FaCheck className="text-lg"/>
                    Pokračovať
                </button>
            </div>
        </div>
        </>
    );
}
