import { useState } from "react";
import {FaCheck, FaCheckCircle, FaSpinner, FaTimesCircle} from "react-icons/fa";
import Joyride from "react-joyride";
import {motion} from "framer-motion";

export function StepComparison({ selectedText, selectedKey, setComparisonResult }) {
    const [result, setResult] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [run, setRun] = useState(true);

    const steps = [
        {
            target: '#startComparisonButton',
            content: 'Tlačidlom spustíte proces počítania zhôd kódov medzi kľúčom a textom.',
        },
        {
            target: '#comparisonResult',
            content: 'Tu sa zobrazí výsledné skóre porovnania kľúča s textom.',
        },
        {
            target: '#comparisonInfo',
            content: 'Informácie o porovnávaní.',
        }
    ];

    const calculateMatches = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutorial/calculate-matches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: selectedText?.content,
                    key: selectedKey?.mapping,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data.result);
                setComparisonResult(data.result);

                // extrahuj všetky kódy z textu
                const foundCodes = selectedText.content.match(/#[0-9a-fA-F]+/g) || [];

                // nájdi všetky kódy z kľúča
                const keyCodes = Object.values(selectedKey.mapping).flat().map(v => `#${v}`);

                const matchInfo = foundCodes.map(code => ({
                    code,
                    matched: keyCodes.includes(code)
                }));

                setMatches(matchInfo);
            } else {
                setResult(null);
                setComparisonResult(null);
            }
        } catch (err) {
            console.error("Chyba pri výpočte zhôd:", err);
            setResult("Nepodarilo sa vykonať výpočet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Joyride
                steps={steps}
                run={run}
                continuous
                showSkipButton
                showProgress
                styles={{ options: { primaryColor: "#212D40", zIndex: 10000 } }}
                locale={{
                    back: 'Späť', close: 'Zavrieť', last: 'Dokončiť',
                    next: 'Ďalej', skip: 'Preskočiť',
                    nextLabelWithProgress: 'Krok {step} z {steps}',
                }}
            />

            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.6, ease: "easeOut"}}
                className="space-y-6">
                <h3 className="text-xl font-bold text-custom-dark-blue text-center">Počet zhôd medzi kľúčom a textom</h3>

                <div className="text-center">
                    <button
                        id="startComparisonButton"
                        onClick={calculateMatches}
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
                                Vypočítať zhody
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
                        className="space-y-4">
                        <div className="bg-green-50 border border-green-300 text-green-800 rounded-xl p-4 text-center" id="comparisonResult">
                            Zhodných znakov: <span className="font-bold">{(result * 100).toFixed(2)} / 100</span>
                        </div>

                        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden" id="comparisonResult">
                            <div
                                className="bg-green-500 h-full transition-all duration-500"
                                style={{width: `${result * 100}%`}}
                            ></div>
                        </div>
                        <div className="mt-4 text-sm text-custom-dark-blue" id="comparisonInfo">
                            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                <h4 className="font-bold">Podrobnosti:</h4>
                                <div className="flex items-center gap-4 text-xs sm:text-sm">
            <span className="flex items-center gap-1 text-green-700">
                <FaCheckCircle className="text-green-600"/> zhoduje sa
            </span>
                                    <span className="flex items-center gap-1 text-red-700">
                <FaTimesCircle className="text-red-600"/> nezhoduje sa
            </span>
                                </div>
                            </div>

                            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {matches.map((m, idx) => (
                                    <li
                                        key={idx}
                                        className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
                                            m.matched
                                                ? 'bg-green-100 border-green-300 text-green-800'
                                                : 'bg-red-100 border-red-300 text-red-800'
                                        }`}
                                    >
                                        {m.matched ? (
                                            <FaCheckCircle className="text-green-600"/>
                                        ) : (
                                            <FaTimesCircle className="text-red-600"/>
                                        )}
                                        <span>{m.code}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </motion.div>
                )}

                {typeof result === "string" && (
                    <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-4 text-center">
                        {result}
                    </div>
                )}
            </motion.div>
        </>
    );
}
