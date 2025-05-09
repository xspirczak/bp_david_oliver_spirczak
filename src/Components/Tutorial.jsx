import {useEffect, useState} from 'react';
import {FaPlayCircle, FaCheckCircle, FaUserEdit, FaKey, FaBook} from 'react-icons/fa';
import { DemoRegistration } from './Tutorial/DemoRegistration.jsx';
import {DemoLogin} from "./Tutorial/DemoLogin.jsx";
import {CiLock} from "react-icons/ci";
import {DemoUploadText} from "./Tutorial/DemoUploadText.jsx";
import {DemoUploadKey} from "./Tutorial/DemoUploadKey.jsx";
import {FaCircleMinus} from "react-icons/fa6";
import {DemoMapping} from "./Tutorial/DemoMapping.jsx";
import {useNavigate} from "react-router-dom";

export default function Tutorial() {
    const navigate = useNavigate();
    const [step, setStep] = useState(null);
    const [progress, setProgress] = useState({
        register: 'unlocked',
        login: 'locked',
        textUpload: 'locked',
        keyUpload: 'locked',
        mapping: 'locked',
        finished: 'uncompleted'
    });

    useEffect(() => {
        const storedProgress = localStorage.getItem('tutorialProgress');
        if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
        } else {
            localStorage.setItem('tutorialProgress', JSON.stringify(progress));
        }
    }, []);

    function TutorialStep({ icon, title, description, buttonText, onClick, state, hidden }) {
        if (hidden) return null;

        const isUnlocked = state === 'unlocked' || state === 'completed';
        const isCompleted = state === 'completed';

        return (
            <div
                className="bg-gray-50 rounded-xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                <div className="mt-1">{icon}</div>

                <div className="flex-1 w-full">
                    <h3 className="text-xl font-semibold text-custom-dark-blue">{title}</h3>
                    <p className="text-custom-dark-blue mb-3 font-light">{description}</p>

                    <div className="flex justify-between sm:justify-start sm:items-center gap-4 sm:w-auto w-full">
                        <button
                            onClick={onClick}
                            className="min-w-[80%] sm:min-w-60 sm:w-auto px-4 py-2 bg-custom-dark-blue text-white rounded-lg hover:bg-custom-dark-blue-hover transition flex items-center gap-2 justify-center disabled:bg-gray-600"
                            disabled={!isUnlocked}
                        >
                            {buttonText}
                            {!isUnlocked && <CiLock className="font-bold"/>}
                        </button>

                        <div
                            className="border-1 border-custom-dark-blue rounded-full flex items-center justify-center bg-custom-dark-blue w-8 h-8 shrink-0">
                            {isCompleted ? (
                                <FaCheckCircle className="text-green-300 w-7 h-7"/>
                            ) : isUnlocked ? (
                                <FaCircleMinus className="text-orange-400 w-7 h-7"/>
                            ) : (
                                <FaCircleMinus className="text-red-400 w-7 h-7"/>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        );
    }

    const goHome = () => {
        navigate('/');
    }

    return (
        <section className="min-h-screen px-4 pb-12 grid justify-center mt-1.5">

            {step === null ? (
                <div>
                    <div className="text-center">
                        <h1 className="text-custom-dark-blue lg:text-fontSize61 md:text-fontSize48 text-fontSize32 font-bold text-center mt-6 px-2">Tutoriál</h1>
                        <p className="text-gray-600 text-lg mb-10">
                            Vyskúšajte si, ako aplikácia funguje, krok za krokom.
                        </p>
                    </div>
                    <div className="space-y-6 animate-fadeIn px-3">
                        <TutorialStep
                            icon={<FaUserEdit className="text-custom-dark-blue w-6 h-6"/>}
                            title="1. Vytvorenie používateľa"
                            description="Simulujte registráciu používateľa pomocou demo údajov."
                            buttonText="Vyskúšať registráciu"
                            onClick={() => setStep('register')}
                            state={progress.register}
                        />

                        <TutorialStep
                            icon={<FaKey className="text-custom-dark-blue w-6 h-6"/>}
                            title="2. Prihlásenie"
                            description="Zistite, ako prebieha prihlásenie a autentifikácia."
                            buttonText="Vyskúšať prihlásenie"
                            onClick={() => setStep('login')}
                            state={progress.login}
                        />

                        <TutorialStep
                            icon={<FaBook className="text-custom-dark-blue w-6 h-6"/>}
                            title="3. Nahrávanie textov"
                            description="Vyskúšajte si nahrávanie šífrovaných textov."
                            buttonText="Spustiť demo"
                            onClick={() => setStep('textUpload')}
                            state={progress.textUpload}

                        />

                        <TutorialStep
                            icon={<FaKey className="text-custom-dark-blue w-6 h-6"/>}
                            title="4. Nahrávanie kľúčov"
                            description="Vyskúšajte si nahrávanie šifrovacích kľúčov."
                            buttonText="Spustiť demo"
                            onClick={() => setStep('keyUpload')}
                            state={progress.keyUpload}

                        />

                        <TutorialStep
                            icon={<FaPlayCircle className="text-custom-dark-blue w-6 h-6" />}
                            title="5. Mapovací algoritmus"
                            description="Mapovací algorimus."
                            buttonText="Vyskúšať mapovanie"
                            onClick={() => setStep('mapping')}
                            state={progress.mapping}

                        />

                        {progress.finished === 'completed' && (
                            <div
                                className="bg-green-50 border border-green-300 rounded-xl p-8 shadow-md text-center space-y-4">
                                <div className="flex justify-center">
                                    <div
                                        className="border-1 border-custom-dark-blue rounded-full flex items-center justify-center bg-custom-dark-blue w-8 h-8 shrink-0">
                                        <FaCheckCircle className="text-green-300 w-7 h-7"/>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-custom-dark-blue">Tutoriál dokončený!</h3>
                                <p className="text-custom-dark-blue font-light">
                                    Skvelá práca! Teraz ste pripravený/á začať používať aplikáciu naplno.
                                </p>
                                <button
                                    onClick={goHome}
                                    className="mt-4 px-4 py-2 bg-custom-dark-blue text-white rounded-xl hover:bg-custom-dark-blue-hover transition"
                                >
                                    Prejsť do aplikácie
                                </button>
                            </div>

                        )}

                    </div>
                </div>
            ) : step === 'register' ? (
                <div className="animate-fadeIn pt-4">
                    <DemoRegistration setProgress={setProgress} progress={progress} setStep={setStep}/>
                </div>
            ) : step === 'login' ? (
                <div className="animate-fadeIn pt-4">
                    <DemoLogin setStep={setStep} setProgress={setProgress} progress={progress}/>
                </div>
            ) : step === 'textUpload' ? (
                <div className="animate-fadeIn pt-4">
                    <DemoUploadText setStep={setStep} setProgress={setProgress} progress={progress}/>
                </div>
            ) : step === 'keyUpload' ? (
                <div className="animate-fadeIn pt-4">
                    <DemoUploadKey setStep={setStep} setProgress={setProgress} progress={progress}/>
                </div>
            ) : step === 'mapping' ? (
                <div className="animate-fadeIn pt-4">
                    <DemoMapping setStep={setStep} setProgress={setProgress} progress={progress}/>
                </div>
            ) : null}
        </section>
    );
}
