import {useEffect, useState} from "react";
import {StepSelectDirection} from "./Mapping/StepSelectDirection.jsx";
import {StepSelectKey} from "./Mapping/StepSelectKey.jsx";
import {StepSelectText} from "./Mapping/StepSelectText.jsx";
import  {StepMapping} from "./Mapping/StepMapping.jsx";
import {StepComparison} from "./Mapping/StepComparison.jsx";
import {StepFrequencyAnalysis} from "./Mapping/StepFrequencyAnalysis.jsx";
import {FaCheck, FaCheckCircle, FaInfoCircle, FaUndo} from "react-icons/fa";
import {FaCircleMinus} from "react-icons/fa6";
import {StepMappingResults} from "./Mapping/StepMappingResults.jsx";
import {StepMappingCombined} from "./Mapping/StepMappingCombined.jsx";
const mockKeys = [
    {
        name: "Kľúč A",
        mapping: {
            H: [1],
            "he": [2, 3],
            "hello world": [22, 11, 111]
        }
    },
    {
        name: "Kľúč B",
        mapping: {
            "d": [12],
            "ca": [13, 4],
            "malá myš": [15, 16]
        }
    },
    {
        name: "Kľúč C",
        mapping: {
            "A": [1],
            "be": [2, 3],
            "Tri slová": [4]
        }
    },
    {
        name: "Kľúč D",
        mapping: {
            "al": [77, 78],
            "B": [88],
            "Beta ver": [89]
        }
    },
    {
        name: "Kľúč E",
        mapping: {
            "Te": [999, 1000],
            "demo text": [1001],
            "X": [1002]
        }
    },
    {
        name: "Kľúč F",
        mapping: {
            "s": [42, 43],
            "Mesiac": [44],
            "Hviezda veľká": [45, 46]
        }
    }
];
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

export function DemoMapping({ setStep , setProgress}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(null); // "textToKey" or "keyToText"
    const [selectedKey, setSelectedKey] = useState(null);
    const [selectedText, setSelectedText] = useState(null);
    const [mappingResult, setMappingResult] = useState(null);
    const [comparisonResult, setComparisonResult] = useState(null);
    const [frequencyResult, setFrequencyResult] = useState(null);
    const [score, setScore] = useState(0);
    const [tutorialFinished, setTutorialFinished] = useState(false);

    const next = () => setCurrentStep(prev => prev + 1);

    useEffect(() => {
        if (currentStep === 8) {
            setProgress(prev => {
                const updated = {
                    ...prev,
                    mapping: 'completed',
                    finished: 'completed'
                };
                localStorage.setItem('tutorialProgress', JSON.stringify(updated));
                return updated;
            });
        }
    }, [currentStep]);



    return (
        <div className="bg-white rounded-xl shadow-lg px-10 pb-10 space-y-6 max-w-screen-sm mx-auto">
            <h2 className="text-fontSize48 font-bold text-custom-dark-blue text-center">Mapovací Algoritmus</h2>
            <p className="text-custom-dark-blue text-center font-light">
                Prejdite si ukážku mapovania šifrovaného textu na kľúč alebo opačne.
            </p>

            <div className="bg-gray-200 rounded-3xl p-4 shadow-sm border border-custom-dark-blue-hover">
                <h3 className="text-lg font-bold text-custom-dark-blue mb-3">Proces mapovania:</h3>
                <ul className="space-y-2 text-custom-dark-blue">
                    <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-custom-dark-blue w-3 h-3 flex-shrink-0 mt-1.5"/>

                        <span>
        Na začiatku sa vyberie <span className="font-bold">smer mapovania</span>
        <span className="relative group inline-block align-middle ml-1">
            <FaInfoCircle className="text-custom-dark-blue text-fontSize12 cursor-pointer mb-0.5"/>
            <span
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1 text-white text-xs bg-custom-dark-blue rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-32 md:max-w-fit md:whitespace-nowrap text-center z-10"
                id="tooltipMappingDirection"
            >
                Mapovať kľúč na text alebo text na kľúč.
            </span>
        </span>
        .
    </span>
                    </li>

                    <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-custom-dark-blue w-3 h-3 flex-shrink-0 mt-1.5"/>
                        <span>Na základe zvoleného smeru mapovania <span className="font-bold">vyberieme dokument</span>
                            <span className="relative group inline-block align-middle ml-1">
            <FaInfoCircle className="text-custom-dark-blue text-fontSize12 cursor-pointer mb-0.5"/>
            <span
                className="absolute top-full max-w-32 md:max-w-fit md:whitespace-nowrap left-1/2 -translate-x-1/2 mt-1 px-3 py-1 text-white text-xs bg-custom-dark-blue rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center z-10"
                id="tooltipSelectDocument"
            >Ššifrovaný text alebo šifrovací kľúč
            </span>
        </span>, na ktorý chceme použiť mapovací algoritmus</span>
                    </li>
                    <li className="flex flex-col gap-1 text-custom-dark-blue">
                        <div className="flex items-start gap-2">
                            <FaCheckCircle className="w-3 h-3 flex-shrink-0 mt-1.5"/>
                            <span>Vyberieme dokument, pomocou ktorého chceme mapovať.</span>
                        </div>
                        <ul className="pl-6 mt-1 space-y-1">
                            <li className="flex items-start gap-2 text-sm text-custom-dark-blue">
                                <FaCircleMinus className="w-3 h-3 flex-shrink-0 mt-1.5"/>
                                <span>V prvej časti dema je proces mapovania <span
                                    className="font-bold">zjednodušený</span>. V reálnom prípade algoritmus skúša všetky dokumenty (texty/kľúče) z databázy (druhá časť tutoriálu).</span>
                            </li>
                        </ul>
                    </li>

                    <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-custom-dark-blue w-3 h-3 flex-shrink-0 mt-1.5"/>
                        <span>Vykoná sa samotný proces mapovania, kde sa <span className="font-bold">kódy</span> z šifrovaného textu nahradia <span
                            className="font-bold">písmenami, slovami alebo slovnymi spojeniami</span>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-custom-dark-blue w-3 h-3 flex-shrink-0 mt-1.5"/>
                        <span>Vypočíta sa <span className="font-bold">počet zhôd</span> (skóre) kódov medzi šifrovacím kľúčom a šfirovaným textom.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-custom-dark-blue w-3 h-3 flex-shrink-0 mt-1.5"/>
                        <span>
        Vykoná sa <span className="font-bold">frekvenčná analýza</span>
        <span className="relative group inline-block align-middle ml-1">
            <FaInfoCircle className="text-custom-dark-blue text-fontSize12 cursor-pointer mb-0.5"/>
            <span
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-2 text-white text-xs bg-custom-dark-blue rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:max-w-fit max-w-32 md:whitespace-nowrap whitespace-normal text-center z-10"
                id="tooltipFrequency"
            >
                Frekvenčná analýza skúma, ako často sa jednotlivé znaky alebo skupiny znakov v texte vyskytujú.
            </span>
        </span> pomocou <span className="font-bold">kosinusovej podobnosti</span>
        <span className="relative group inline-block align-middle ml-1">
            <FaInfoCircle className="text-custom-dark-blue text-fontSize12 cursor-pointer mb-0.5"/>
            <span
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-2 text-white text-xs bg-custom-dark-blue rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:max-w-fit max-w-32 md:whitespace-nowrap whitespace-normal text-center z-10"
                id="tooltipCosine"
            >
                Kosínusová podobnosť meria, ako veľmi sú si dva vektory podobné na základe ich smeru.
            </span>
        </span>
        .
    </span>
                    </li>


                </ul>
            </div>
            {/* User vyberie bud chce skusit mapovat kluc na text alebo opacne */}

            {currentStep === 1 && (
                <StepSelectDirection
                    direction={direction}
                    setDirection={setDirection}
                />
            )}
            {/* vyberie si z ponuky klucov ktory chce mapovat */}

            {currentStep === 2 && (
                direction === "textToKey" ? (
                    <StepSelectText
                        direction={direction}
                        selectedText={selectedText}
                        setSelectedText={setSelectedText}
                        mockTexts={mockTexts}
                    />
                ) : (
                    <StepSelectKey
                        direction={direction}
                        selectedKey={selectedKey}
                        setSelectedKey={setSelectedKey}
                        mockKeys={mockKeys}
                    />
                )
            )}
            {/* vyberie si z ponuky textov pomocou ktoreho chce mapovat */}

            {currentStep === 3 && (
                direction === "keyToText" ? (
                    <StepSelectText
                        direction={direction}
                        selectedText={selectedText}
                        setSelectedText={setSelectedText}
                        mockTexts={mockTexts}
                    />

                ) : (
                    <StepSelectKey
                        direction={direction}
                        selectedKey={selectedKey}
                        setSelectedKey={setSelectedKey}
                        mockKeys={mockKeys}
                    />
                )
            )}

            {/* samotny proces mapovoania, kde sa zobrazi namapovani dokument na konci */}
            {currentStep === 4 && (
                <StepMapping
                    selectedText={selectedText}
                    selectedKey={selectedKey}
                    setMappingResult={setMappingResult}
                />
            )}
            {/* tu prejdeme do hodnotiacej casti algoritmu, kde sa vypocitaju kodove zhody*/}

            {currentStep === 5 && (
                <StepComparison
                    selectedText={selectedText}
                    selectedKey={selectedKey}
                    setComparisonResult={setComparisonResult}
                />
            )}
            {/* nakoniec frekvecna analyza, na konci sa zobrazi skore mapovania..*/}

            {currentStep === 6 && (
                <StepFrequencyAnalysis
                    mappingResult={mappingResult}
                    setFrequencyResult={setFrequencyResult}
                />
            )}

            {currentStep === 7 && (
                <StepMappingResults
                    comparisonResult={comparisonResult}
                    frequencyResult={frequencyResult}
                    setScore={setScore}
                    score={score}
                />
            )}

            {currentStep === 8 && (
                <StepMappingCombined
                    direction={direction}
                    mockTexts={mockTexts}
                    mockKeys={mockKeys}
                    selectedText={selectedText}
                    selectedKey={selectedKey}
                    score={score}
                    setTutorialFinished={setTutorialFinished}
                />
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-300">

                {currentStep !== 8 && (<>

                        <button
                            onClick={() => setStep(null)}
                            className="flex items-center gap-2 px-5 py-2 text-custom-dark-blue border border-custom-dark-blue rounded-2xl hover:bg-custom-dark-blue hover:text-white transition-all duration-300"
                        >
                            <FaUndo className="text-lg"/>
                            Späť na menu
                        </button>

                        <button
                            onClick={next}
                            id="nextStepButton"
                            disabled={
                                (currentStep === 1 && !direction) ||
                                (currentStep === 2 && (
                                    (direction === "textToKey" && !selectedText) ||
                                    (direction === "keyToText" && !selectedKey)
                                )) ||
                                (currentStep === 3 && (
                                    (direction === "textToKey" && !selectedKey) ||
                                    (direction === "keyToText" && !selectedText)
                                )) ||
                                (currentStep === 4 && !mappingResult) ||
                                (currentStep === 5 && comparisonResult === null) ||
                                (currentStep === 6 && !frequencyResult)
                            }
                            className="flex items-center gap-2 px-5 py-2 bg-custom-dark-blue text-white rounded-2xl hover:bg-custom-dark-blue-hover transition-all duration-300 disabled:opacity-50"
                        >
                            <FaCheck className="text-lg"/>
                            Ďalší krok
                        </button>
                    </>
                )}

                {currentStep === 8 && (
                    <div className="w-full flex justify-center">
                        <button
                            onClick={() => {setStep(null)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            id="endButton"
                            disabled={currentStep === 8 && !tutorialFinished}
                            className="flex items-center gap-2 px-5 py-2 bg-custom-dark-blue text-white rounded-2xl hover:bg-custom-dark-blue-hover transition-all duration-300 disabled:opacity-50"
                        >
                            <FaCheck className="text-lg"/>
                            Ukončiť tutoriál
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
