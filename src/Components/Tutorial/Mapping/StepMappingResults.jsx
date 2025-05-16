import {useEffect} from "react";
import {motion} from "framer-motion";

export function StepMappingResults ({comparisonResult, frequencyResult, setScore, score}) {

    useEffect( () => {
        setScore((frequencyResult*100 *0.5) + (comparisonResult *100*0.5));
    }, [comparisonResult, frequencyResult])

    return (
        <motion.div
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, ease: "easeOut"}}
            className="space-y-8 text-center">
            <h3 className="text-3xl font-bold text-custom-dark-blue">Výsledky mapovania</h3>

            <div className="grid sm:grid-cols-3 gap-4 text-custom-dark-blue">
                <div
                    className="bg-gray-200 border border-custom-dark-blue rounded-xl p-6 shadow-md grid justify-center items-center">
                    <h4 className="text-lg font-semibold mb-2">Skóre zhôd kódov</h4>
                    <p className="text-3xl font-bold text-green-700">
                        {(Number(comparisonResult) * 100).toFixed(2)} <span className="text-base">/ 100</span>
                    </p>
                </div>

                <div
                    className="bg-gray-200 border border-custom-dark-blue rounded-xl p-6 shadow-md grid justify-center items-center">
                    <h4 className="text-lg font-semibold mb-2">Skóre frekvenčnej analýzy</h4>
                    <p className="text-3xl font-bold text-blue-700">
                        {(Number(frequencyResult) * 100).toFixed(2)} <span className="text-base">/ 100</span>
                    </p>
                </div>

                <div
                    className="bg-gray-200 border border-custom-dark-blue rounded-xl p-6 shadow-md grid justify-center items-center">
                    <h4 className="text-lg font-semibold mb-2">Celkové skóre</h4>
                    <p className="text-3xl font-bold text-purple-700">
                        {score.toFixed(2)} <span className="text-base">/ 100</span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}


