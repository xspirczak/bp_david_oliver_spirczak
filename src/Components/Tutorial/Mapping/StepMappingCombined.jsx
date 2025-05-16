import { useState } from "react";
import {FaCheck, FaSpinner} from "react-icons/fa";
import Joyride from "react-joyride";
import {motion} from "framer-motion";

export function StepMappingCombined({ direction, mockKeys, mockTexts, selectedKey, selectedText, score, setTutorialFinished }) {
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [run, setRun] = useState(true);
    const steps = [
        {
            target: '#startCombinedMappingButton',
            content: 'Tlačidlo na začatie automatického mapovania.',
        },
        {
            target: '#mappedDoc',
            content: 'Pôvodny vybraný dokument.',
        },
        {
            target: '#bestFitDoc',
            content: 'Najvhodnejší dokument pre vami vybraný dokument.',
        },
        {
            target: '#plaintext',
            content: 'Dešifrovaný text.',
        },
        {
            target: 'button#nextStepButton',
            content: 'Tlačidlom dokončíte tutoriál.',
        }
    ];



    const handleBulkMapping = async () => {
        setError('');
        setResult(null);
        setLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutorial/combined-mapping`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    direction,
                    mappedObject: direction === "textToKey" ? selectedText.content : selectedKey.mapping,
                    mappedObjects: direction === "textToKey" ? mockKeys : mockTexts
                }),
            });

            if (!response.ok) {
                setError("Chyba pri mapovaní.");
                setLoading(false);
                return;
            }

            const data = await response.json();
            if (data) setResult(data);

            setLoading(false);
            setTutorialFinished(true);
        } catch (err) {
            setLoading(false);
            console.error(err);
            setError("Nastala chyba pri odosielaní požiadavky.");
        }
    };

    const renderMappingContent = () => {
        if (direction === "textToKey") {
            return (
                <p className="break-words whitespace-pre-wrap">{JSON.stringify(result.content, null, 2)}</p>
            );
        }

        return <p className="break-words whitespace-pre-wrap">{result.content}</p>;
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
                 <div className="text-center">
                <button
                    id="startCombinedMappingButton"
                    onClick={handleBulkMapping}
                    disabled={loading}
                    className="px-5 py-2 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                >
                    {loading ? (
                        <>
                            <FaSpinner className="animate-spin"/>
                            Mapujem...
                        </>
                    ) : (
                        <>
                            <FaCheck/>
                            Mapovať všetky {direction === "textToKey" ? "kľúče na tento text" : "texty na tento kľúč"}
                        </>
                    )}
                </button>
            </div>

            {error && <div className="text-red-600 font-medium">{error}</div>}

            {result && (
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6, ease: "easeOut"}}
                    className="border border-gray-200 rounded-xl shadow-sm p-6 bg-white space-y-6">
                    <h2 className="text-custom-dark-blue font-bold text-fontSize20 text-center" id="mappingResult">Výsledok mapovania - skóre: <span className="text-fontSize24">{(result.score *100).toFixed(2)} / 100 </span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-800">
                        <div>
                            <h3 className="font-semibold mb-2 text-custom-dark-blue">
                                Pôvodný {direction === "textToKey" ? "text" : "kľúč"}:
                            </h3>
                            <div className="bg-gray-50 p-3 rounded border text-xs whitespace-pre-wrap break-words min-h-28 max-h-28 overflow-y-auto" id="mappedDoc">
                                {direction === "textToKey"
                                    ? selectedText.content
                                    : JSON.stringify(selectedKey.mapping, null, 2)}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-custom-dark-blue">
                                Použitý {direction === "textToKey" ? "kľúč" : "text"}:
                            </h3>
                            <div className="bg-gray-50 p-3 rounded border text-xs min-h-28 max-h-28 overflow-y-auto" id="bestFitDoc">
                                {renderMappingContent()}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-custom-dark-blue">Dešifrovaný text:</h3>
                            <div className="bg-gray-50 p-3 rounded border text-xs whitespace-pre-wrap break-words min-h-28" id="plaintext">
                                {result.plaintext}
                            </div>
                        </div>
                    </div>

                    <div className="text-fontSize16 text-custom-dark-blue">
                        <span className="font-semibold">Skóre: {(result.score *100).toFixed(2)} </span>oproti pôvodnému skóre <span className="font-semibold">{(score).toFixed(2)}</span>, ktoré bolo získame mapovaním, kde sa manuálne vyberal text a kľúč.
                    </div>
                </motion.div>
            )}
        </motion.div>
    </>
    );
}
