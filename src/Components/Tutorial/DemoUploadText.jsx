import {useEffect, useRef, useState} from 'react';
import { FaCheck, FaCheckCircle, FaUndo, FaBug } from 'react-icons/fa';
import Joyride from "react-joyride";

export function DemoUploadText({ setProgress, setStep, progress }) {
    const [text, setText] = useState('');
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(false);

    const validDemoText = "test#959#641#867#962#903 toto je #89#830 #846 #482#776#830#684 #867#673#814 #563#610 this#5#417#712#638#903#913#959 #744#610#91d1#377 validny #372#89#913#822#37#677#512 te#455t ?";

    const [run, setRun] = useState(true);
    const steps = [
        {
            target: 'button#validData',
            content: 'Vyskúšajte si nahratie validného textu.',
        },
        {
            target: 'button#invalidData',
            content: 'Vyskúšajte si nahratie nevalidného textu.'
        },
        {
            target: 'textarea',
            content: 'Alebo text zadajte manuálne.',
        },
        {
            target: 'button#resetData',
            content: 'Tlačidlo na vymazanie textu.',
        },

        {
            target: 'button#submitData',
            content: 'Kliknite na tlačidlo pre nahratie textu.',
        }
    ];


    const validateText = () => {
        const errs = [];
        if (!text.trim()) {
            errs.push("Text nesmie byť prázdny.");
        }

        const validFormat = /^([A-Za-z]+|#[0-9a-fA-F]+|[!.,?]|\s)+$/;

        if (!validFormat.test(text)) {
            errs.push("Text obsahuje neplatné znaky alebo formát.");
        }

        if (errs.length > 0) {
            setErrors(errs);
            setSuccess(false);
        } else {
            setErrors([]);
            setSuccess(true);
            setProgress(prev => {
                const updated = {
                    ...prev,
                    textUpload: 'completed',
                    keyUpload: prev.keyUpload === 'locked' ? 'unlocked' : prev.keyUpload
                };
                localStorage.setItem('tutorialProgress', JSON.stringify(updated));
                return updated;
            });
        }
    };

    const useDemo = (type) => {
        if (type === 'valid') {
            setText(validDemoText);
        }
        setErrors([]);
        setSuccess(false);
    };


    const reset = () => {
        setText('');
        setErrors([]);
        setSuccess(false);
    };


    function InvalidTextSelect({ setText, setErrors, setSuccess }) {
        const [open, setOpen] = useState(false);
        const [selected, setSelected] = useState("Nevalidné údaje");
        const ref = useRef(null);

        const invalidDemoTexts = [
            { name: "Chýba kód medzi mriežkami", value: "test##invalid#text" },
            { name: "Nepovolené znaky", value: "toto @je !zlé ###" },
            { name: "Neplatný formát", value: "## test #abc#" }
        ];

        const handleSelect = (item) => {
            setSelected(item.name);
            setText(item.value);
            setErrors([]);
            setSuccess(false);
            setOpen(false);
        };

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

        return (
            <div ref={ref} className="relative group w-full sm:w-2/5 flex justify-center">
                <button
                    onClick={() => setOpen(!open)}
                    id="invalidData"
                    className="w-2/3 sm:w-full flex items-center justify-between border border-red-300 bg-red-100 rounded-3xl px-3 py-1 text-red-800 font-medium"
                >
                    <div className="flex items-center gap-2">
                        <FaBug />
                        {selected}
                    </div>
                    <span className="text-lg">▾</span>
                </button>

                {open && (
                    <ul className="absolute left-1/2 -translate-x-1/2 mt-10 w-2/3 sm:w-full bg-white border border-red-300 rounded-xl shadow-lg overflow-hidden z-20">
                        {invalidDemoTexts.map((item, idx) => (
                            <li
                                key={idx}
                                onClick={() => handleSelect(item)}
                                className="px-4 py-2 text-red-700 hover:bg-red-100 cursor-pointer text-sm"
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }


    return (
        <>
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
            <h2 className="text-fontSize48 font-bold text-custom-dark-blue text-center">Demo Nahrávanie Textu</h2>
            <p className="text-custom-dark-blue text-center font-light">
                Vyskúšajte si nahratie a validáciu šifrovaného textu. Môžete vložiť vlastný alebo použiť demo vstup.
            </p>


            <div className="bg-gray-200 rounded-3xl p-4 shadow-sm border border-custom-dark-blue-hover">
                <h3 className="text-lg font-bold text-custom-dark-blue mb-3">Požiadavky na nahratie textu:</h3>
                <ul className="space-y-2 text-custom-dark-blue">
                    <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-custom-dark-blue w-3 h-3 flex-shrink-0 mt-1.5"/>
                        <span>Text nesmie byť prázdny.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-custom-dark-blue w-3 h-3 flex-shrink-0 mt-1.5"/>
                        <span>Povolené sú len písmená,
                        medzery a interpunkcia (vo formáte napr. <span className="font-bold">#1es#1 i#1</span>.</span>
                    </li>
                </ul>
            </div>

            <div className="mb-6 border-b border-gray-300 pb-2 text-center">
                <p className="text-custom-dark-blue text-fontSize20 font-semibold">Testovacie dáta:</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative group w-full sm:w-2/5 flex justify-center">
                    <button
                        onClick={() => useDemo('valid')}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-3xl  flex items-center justify-center gap-2 w-2/3 sm:w-full border border-green-300 text-fontSize16"
                        id="validData"
                    >
                        <FaCheck/> Validné údaje
                    </button>
                    <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-green-200 text-green-900 text-sm px-3 py-1 rounded-xl shadow-lg opacity-0 sm:group-hover:opacity-100 transition-opacity z-10 whitespace-pre-line max-w-fit"
                    >
                        {validDemoText}
                    </div>
                </div>
                <InvalidTextSelect setText={setText} setErrors={setErrors} setSuccess={setSuccess}/>


                <div className="w-full sm:w-1/5 flex justify-center">
                    <button
                        onClick={reset}
                        id="resetData"
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-3xl  flex items-center justify-center gap-2 w-2/3 sm:w-full border border-gray-400"
                    >
                        <FaUndo/> Vymazať
                    </button>
                </div>
            </div>
            <p className="text-custom-dark-blue text-center font-light">
                Demo údaje sú len na ukážku a nemajú žiadny skutočný účel.
            </p>


            <div className="flex flex-col gap-2">
                <textarea
                    className="border border-gray-300 rounded-xl p-4 resize-none min-h-[120px]"
                    placeholder="Vložte šifrovaný text..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className="flex justify-between gap-2 flex-wrap mt-6">
                    <button onClick={validateText} id="submitData"
                            className="w-full text-white text-fontSize16 font-semibold leading-6 hover:bg-custom-dark-blue-hover bg-custom-dark-blue focus:outline-none rounded-3xl px-5 py-1.5 text-center"> Demo
                        nahrať text
                    </button>
                </div>
            </div>


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
                        Demo nahratie textu prebehlo úspešne!
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-300">
                <button
                    onClick={() => setStep(null)} // Späť na menu
                    className="flex items-center gap-2 px-5 py-2 text-custom-dark-blue border border-custom-dark-blue rounded-2xl hover:bg-custom-dark-blue hover:text-white transition-all duration-300"
                >
                    <FaUndo className="text-lg"/>
                    Späť na menu
                </button>
                <button
                    onClick={() => setStep('keyUpload')}
                    disabled={progress.textUpload !== 'completed'}
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
