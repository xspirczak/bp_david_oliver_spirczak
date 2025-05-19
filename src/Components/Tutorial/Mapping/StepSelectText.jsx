import {useState} from "react";
import Joyride from "react-joyride";
import {motion} from "framer-motion";

export function StepSelectText({ selectedText, setSelectedText, mockTexts }) {
    const [run, setRun] = useState(true);
    const steps = [
        {
            target: '#textSelectionTitle',
            content: 'Tu si zvoľte šfirovaný text, ktorý sa použije na vyhľadávanie.',
        },
        {
            target: '#text0',
            content: 'Kliknite na jeden z textov, napríklad tento.',
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
            <h3 className="text-xl font-semibold text-custom-dark-blue text-center" id="textSelectionTitle">
                Vyberte šifrovaný text
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
                {mockTexts.map((textObj, idx) => {
                    const isSelected = selectedText === textObj;
                    return (
                        <button
                            id={idx === 0 ? 'text0' : undefined}
                            key={idx}
                            onClick={() => setSelectedText(textObj)}
                            className={`p-4 rounded-2xl shadow-md border-2 transition-all duration-200 text-left
                                ${isSelected
                                ? "bg-custom-dark-blue text-white border-custom-dark-blue"
                                : "bg-white text-custom-dark-blue border-gray-300 hover:border-custom-dark-blue"}
                            `}
                        >
                            <h4 className="text-lg font-semibold mb-2">{textObj.text}</h4>
                            <p className="text-sm whitespace-pre-wrap font-mono bg-gray-100 p-2 rounded text-custom-dark-blue max-h-[60px] min-h-[60px] overflow-auto">
                                {textObj.content}
                            </p>
                        </button>
                    );
                })}
            </div>
        </motion.div>
            </>
    );
}
