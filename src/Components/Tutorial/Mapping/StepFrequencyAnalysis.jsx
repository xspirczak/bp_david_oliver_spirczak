import { useState } from "react";
import { FaCheck, FaSpinner, FaInfoCircle, FaExclamationTriangle, FaThumbsUp } from "react-icons/fa";
import Joyride from "react-joyride";
import {FrequencyChart} from "../FrequencyChart.jsx";
import {motion} from "framer-motion";

export function StepFrequencyAnalysis({ mappingResult, setFrequencyResult }) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [run, setRun] = useState(true);

    const steps = [
        {
            target: '#startFrequencyButton',
            content: 'Tlačidlom spustíte proces frekvečnej analýzy pomocou kosínusovej podobnosti.',
        },
        {
            target: '#frequencyResult',
            content: 'Tu sa zobrazí skóre, ktoré vyjadruje podobnosť rozloženia znakov medzi textom a referenčnou frekvenciou.',
        },
        {
            target: 'button#nextStepButton',
            content: 'Tlačidlom prejdete na ďalší krok algoritmu.',
        }
    ];

    const calculateFrequency = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutorial/calculate-frequency-score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plaintext: mappingResult }),
            });

            const data = await response.json();
            setResult(data.result ?? "");
            setFrequencyResult(data.result ?? "");
        } catch (err) {
            console.error("Chyba pri frekvenčnej analýze:", err);
            setResult("Nepodarilo sa vykonať frekvenčnú analýzu.");
        } finally {
            setLoading(false);
        }
    };

    const getFeedback = (value) => {
        if (value >= 0.8) return { label: "Výborné skóre", icon: <FaThumbsUp className="text-green-600" /> };
        if (value >= 0.5) return { label: "Priemerné skóre", icon: <FaExclamationTriangle className="text-yellow-600" /> };
        return { label: "Slabé skóre", icon: <FaExclamationTriangle className="text-red-600" /> };
    };

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

            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.6, ease: "easeOut"}}
                className="space-y-6">
                <h3 className="text-xl font-bold text-custom-dark-blue text-center flex items-center justify-center gap-2">
                    Frekvenčná analýza
                </h3>

                <div className="text-center">
                    <button
                        id="startFrequencyButton"
                        onClick={calculateFrequency}
                        disabled={loading}
                        className="px-5 py-2 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Počítam...
                            </>
                        ) : (
                            <>
                                <FaCheck />
                                Spustiť analýzu
                            </>
                        )}
                    </button>
                </div>

                {typeof result === "number" && (
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.6, ease: "easeOut"}}
                        id="frequencyResult"
                        className={`rounded-xl p-4 text-center border ${
                            result >= 0.8
                                ? 'bg-green-50 border-green-300 text-green-800'
                                : result >= 0.5
                                    ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                                    : 'bg-red-50 border-red-300 text-red-800'
                        }`}
                    >
                        <div className="text-lg font-semibold flex items-center justify-center gap-2">
                            {getFeedback(result).icon}
                            {getFeedback(result).label}
                        </div>
                        <div className="text-sm mt-2">
                            Skóre podobnosti: <span className="font-bold">{(result * 100).toFixed(2)} / 100</span>
                        </div>
                        <FrequencyChart plaintext={mappingResult} />

                    </motion.div>

                )}

                {typeof result === "string" && (
                    <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-4 text-center" id="frequencyResult">
                        {result}
                    </div>
                )}
            </motion.div>
        </>
    );
}
