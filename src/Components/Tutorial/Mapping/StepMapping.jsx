import { useState } from "react";
import { FaCheck, FaSpinner } from "react-icons/fa";
import Joyride from "react-joyride";
import {motion} from "framer-motion";

export function StepMapping({ selectedText, selectedKey, setMappingResult }) {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [run, setRun] = useState(true);

    const steps = [
        {
            target: '#mappingCypherText',
            content: 'Pôvodný zašifrovaný text.',
        },
        {
            target: '#startMappingButton',
            content: 'Tlačidlom spustíte proces vyhľadávania.',
        },
        {
            target: '#mappingResult',
            content: 'Tu sa zobrazí výsledok vyhľadávania v porovnaní s pôvodným šifrovaným textom.',
        },

    ];

    const map = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutorial/decrypt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: selectedText?.content,
                    key: selectedKey?.mapping,
                }),
            });


            const data = await response.json();
            //console.log(data)

            setResult(data.result || "");
            setMappingResult(data.result || "");
        } catch (err) {
            //console.error("Chyba pri mapovaní:", err);
            setResult("Nepodarilo sa vykonať vyhľadávanie.");
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
                <h3 className="text-xl font-bold text-custom-dark-blue text-center">Proces vyhľadávania</h3>

                <div className="text-center">
                    <button
                        id="startMappingButton"
                        onClick={map}
                        disabled={loading}
                        className="w-1/2 px-5 py-2 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Vyhľadávam...
                            </>
                        ) : (
                            <>
                                <FaCheck />
                                Spustiť vyhľadávanie
                            </>
                        )}
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div id="mappingCypherText">
                        <h4 className="text-custom-dark-blue font-semibold mb-2">Pôvodný šifrovaný text:</h4>
                        <div className="p-4 border border-gray-300 bg-gray-50 rounded-xl min-h-[150px] text-sm text-gray-700 whitespace-pre-wrap">
                            {selectedText?.content || "—"}
                        </div>
                    </div>

                    <div id="mappingResult">
                        <h4 className="text-custom-dark-blue font-semibold mb-2">Výsledok vyhľadávania:</h4>
                        <div className="p-4 border border-gray-300 bg-gray-50 rounded-xl min-h-[150px] text-sm text-gray-800 whitespace-pre-wrap">
                            {result || "—"}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
