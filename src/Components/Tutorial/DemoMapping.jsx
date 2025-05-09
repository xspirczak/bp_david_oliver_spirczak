import {useEffect, useState} from "react";
import {StepSelectDirection} from "./Mapping/StepSelectDirection.jsx";
import {StepSelectKey} from "./Mapping/StepSelectKey.jsx";
import {StepSelectText} from "./Mapping/StepSelectText.jsx";
import  {StepMapping} from "./Mapping/StepMapping.jsx";
import {StepComparison} from "./Mapping/StepComparison.jsx";
import {StepFrequencyAnalysis} from "./Mapping/StepFrequencyAnalysis.jsx";
import {FaCheck, FaCheckCircle, FaUndo} from "react-icons/fa";
import {FaCircleMinus} from "react-icons/fa6";

export function DemoMapping({ setStep , setProgress}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(null); // "textToKey" or "keyToText"
    const [selectedKey, setSelectedKey] = useState(null);
    const [selectedText, setSelectedText] = useState(null);
    const [mappingResult, setMappingResult] = useState(null);
    const [comparisonResult, setComparisonResult] = useState(null);
    const [frequencyResult, setFrequencyResult] = useState(null);

    const next = () => setCurrentStep(prev => prev + 1);

    useEffect(() => {
        if (currentStep === 7) {
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
                        <span>Na začiatku sa vyberie <span className="font-bold">smer mapovania</span> (či chceme mapovať šifrovaný text na šifrovací kľúč alebo opačne).</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-custom-dark-blue w-3 h-3 flex-shrink-0 mt-1.5"/>
                        <span>Na základe zvoleného smeru mapovania <span className="font-bold">vyberieme dokument</span> (text alebo kľúč), na ktorý chceme použiť mapovací algoritmus.</span>
                    </li>
                    <li className="flex flex-col gap-1 text-custom-dark-blue">
                        <div className="flex items-start gap-2">
                            <FaCheckCircle className="w-3 h-3 flex-shrink-0 mt-1.5"/>
                            <span>Vyberieme dokument, pomocou ktorého chceme mapovať.</span>
                        </div>
                        <ul className="pl-6 mt-1 space-y-1">
                            <li className="flex items-start gap-2 text-sm text-custom-dark-blue">
                                <FaCircleMinus className="w-3 h-3 flex-shrink-0 mt-1.5"/>
                                <span>V deme je proces mapovania <span className="font-bold">zjednodušený</span>. V reálnom prípade algoritmus skúša všetky dokumenty (texty/kľúče) z databázy.</span>
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
                        <span>Vykoná sa <span className="font-bold">frekvenčná analýza</span> pomocou <span
                            className="font-bold">kosinusovej podobnosti</span>.</span>
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
                    />
                ) : (
                    <StepSelectKey
                        direction={direction}
                        selectedKey={selectedKey}
                        setSelectedKey={setSelectedKey}
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
                    />

                ) : (
                    <StepSelectKey
                        direction={direction}
                        selectedKey={selectedKey}
                        setSelectedKey={setSelectedKey}
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

            {currentStep === 7 ? (
                <>
                    <div className="space-y-8 text-center">
                        <h3 className="text-3xl font-bold text-custom-dark-blue">Výsledky mapovania</h3>

                        <div className="grid sm:grid-cols-3 gap-4 text-custom-dark-blue">
                            <div className="bg-gray-200 border border-custom-dark-blue rounded-xl p-6 shadow-md grid justify-center items-center">
                                <h4 className="text-lg font-semibold mb-2">Skóre zhôd kódov</h4>
                                <p className="text-3xl font-bold text-green-700">
                                    {(Number(comparisonResult) * 100).toFixed(2)} <span className="text-base">/ 100</span>
                                </p>
                            </div>

                            <div className="bg-gray-200 border border-custom-dark-blue rounded-xl p-6 shadow-md grid justify-center items-center">
                                <h4 className="text-lg font-semibold mb-2">Skóre frekvenčnej analýzy</h4>
                                <p className="text-3xl font-bold text-blue-700">
                                    {(Number(frequencyResult) * 100).toFixed(2)} <span className="text-base">/ 100</span>
                                </p>
                            </div>

                            <div className="bg-gray-200 border border-custom-dark-blue rounded-xl p-6 shadow-md grid justify-center items-center">
                                <h4 className="text-lg font-semibold mb-2">Celkové skóre</h4>
                                <p className="text-3xl font-bold text-purple-700">
                                    {(
                                        ((Number(frequencyResult) * 100) * 0.5) +
                                        ((Number(comparisonResult) * 100) * 0.5)
                                    ).toFixed(2)} <span className="text-base">/ 100</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-8 border-t border-gray-300 mt-8">
                        <button
                            onClick={() => setStep(null)}
                            className="flex items-center gap-2 px-6 py-2 text-custom-dark-blue border border-custom-dark-blue rounded-2xl hover:bg-custom-dark-blue hover:text-white transition-all duration-300"
                        >
                            <FaUndo className="text-lg" />
                            Späť na menu
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-300">
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
                </div>
            )}
        </div>
    );
}
