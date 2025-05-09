import {useState} from "react";
import Joyride from "react-joyride";

const mockTexts = [
    {
        text: "Text A",
        content: "#1 #3 hello #22."
    },
    {
        text: "Text B",
        content: "ca #13 #14 demo #1001"
    },
    {
        text: "Text C",
        content: "#999 Te je #1002."
    },
    {
        text: "Text D",
        content: "#42 #43 s Mesiac #44"
    },
    {
        text: "Text E",
        content: "Hviezda #45 veľká #46 je jasná."
    },
    {
        text: "Text F",
        content: "#77 #78 al B #88"
    }
];


export function StepSelectText({ selectedText, setSelectedText }) {
    const [run, setRun] = useState(true);
    const steps = [
        {
            target: '#textSelectionTitle',
            content: 'Tu si zvoľte šfirovaný text, ktorý sa použije na mapovanie.',
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
        <div className="space-y-6">
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
                            <p className="text-sm whitespace-pre-wrap font-mono bg-gray-100 p-2 rounded text-custom-dark-blue max-h-[150px] min-h-[150px] overflow-auto">
                                {textObj.content}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
            </>
    );
}
