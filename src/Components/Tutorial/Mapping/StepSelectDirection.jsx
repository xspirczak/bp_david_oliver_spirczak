import {useState} from "react";
import Joyride from "react-joyride";
import {motion} from "framer-motion";

export function StepSelectDirection({ direction, setDirection }) {
    const [run, setRun] = useState(true);
    const steps = [
        {
            target: 'div#mappingDirection',
            content: 'Vyberte smer mapovania.',
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
            <h3 className="text-xl font-bold text-custom-dark-blue text-center">Zvoľte smer mapovania</h3>
            <div className="grid sm:flex gap-4 justify-center" id="mappingDirection">
                <label
                    htmlFor="optionKeyToText"
                    className={`cursor-pointer rounded-2xl px-6 py-4 border-2 text-center shadow-md transition-all duration-200
                        ${direction === "keyToText"
                        ? "bg-custom-dark-blue text-white border-custom-dark-blue shadow-lg"
                        : "bg-white text-custom-dark-blue border-gray-300 hover:border-custom-dark-blue-hover hover:bg-gray-100"}
                    `}
                >
                    <input
                        type="radio"
                        id="optionKeyToText"
                        className="hidden"
                        name="mappingDirection"
                        checked={direction === "keyToText"}
                        onChange={() => setDirection("keyToText")}
                    />
                    <span className="text-base font-medium">Kľúč → Text</span>
                </label>

                <label
                    htmlFor="optionTextToKey"
                    className={`cursor-pointer rounded-2xl px-6 py-4 border-2 text-center shadow-md transition-all duration-200
                        ${direction === "textToKey"
                        ? "bg-custom-dark-blue text-white border-custom-dark-blue shadow-lg"
                        : "bg-white text-custom-dark-blue border-gray-300 hover:border-custom-dark-blue-hover hover:bg-gray-100"}
                    `}
                >
                    <input
                        type="radio"
                        id="optionTextToKey"
                        className="hidden"
                        name="mappingDirection"
                        checked={direction === "textToKey"}
                        onChange={() => setDirection("textToKey")}
                    />
                    <span className="text-base font-medium">Text → Kľúč</span>
                </label>
            </div>
        </motion.div>
        </>
    );
}
