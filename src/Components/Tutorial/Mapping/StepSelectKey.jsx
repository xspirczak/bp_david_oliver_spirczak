import {useState} from "react";
import Joyride from "react-joyride";
import {motion} from "framer-motion";

export function StepSelectKey({ selectedKey, setSelectedKey, mockKeys }) {
    const [run, setRun] = useState(true);
    const steps = [
        {
            target: '#keySelectionTitle',
            content: 'Tu si zvoľte šifrovací kľúč, ktorý sa použije na mapovanie.',
        },
        {
            target: '#key0',
            content: 'Kliknite na jeden z kľúčov, napríklad tento.',
        },
        {
            target: 'button#nextStepButton',
            content: 'Tlačidlom potvrdte svoj výber.',
        }
    ];

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
            <h3 className="text-xl font-semibold text-custom-dark-blue text-center" id="keySelectionTitle">
               Vyberte šifrovací kľúč
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
                {mockKeys.map((key, idx) => {
                    const isSelected = selectedKey === key;
                    return (
                        <button
                            id={idx === 0 ? 'key0' : undefined}
                            key={idx}
                            onClick={() => setSelectedKey(key)}
                            className={`p-4 rounded-2xl shadow-md border-2 transition-all duration-200 text-left
                                ${isSelected
                                ? "bg-custom-dark-blue text-white border-custom-dark-blue"
                                : "bg-white text-custom-dark-blue border-gray-300 hover:border-custom-dark-blue"}
                            `}
                        >
                            <h4 className="text-lg font-semibold mb-2">{key.name}</h4>
                            <pre className="text-sm whitespace-pre-wrap font-mono bg-gray-100 p-2 rounded text-custom-dark-blue max-h-[150px] min-h-[150px] overflow-auto">
                                {JSON.stringify(key.mapping, null, 2)}
                            </pre>
                        </button>
                    );
                })}
            </div>
        </motion.div>
            </>
    );
}
