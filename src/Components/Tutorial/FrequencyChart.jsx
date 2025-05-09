import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const expectedEnglishFrequencies = {
    "a": 0.08167, "b": 0.01492, "c": 0.02782, "d": 0.04253,
    "e": 0.12702, "f": 0.02228, "g": 0.02015, "h": 0.06094,
    "i": 0.06966, "j": 0.00153, "k": 0.00772, "l": 0.04025,
    "m": 0.02406, "n": 0.06749, "o": 0.07507, "p": 0.01929,
    "q": 0.00095, "r": 0.05987, "s": 0.06327, "t": 0.09056,
    "u": 0.02758, "v": 0.00978, "w": 0.0236, "x": 0.0015,
    "y": 0.01974, "z": 0.00074
};

function getLetterFrequency(text) {
    const counts = {};
    let total = 0;

    for (let char of text.toLowerCase()) {
        if (char >= 'a' && char <= 'z') {
            counts[char] = (counts[char] || 0) + 1;
            total++;
        }
    }

    const frequencies = {};
    for (const [letter, count] of Object.entries(counts)) {
        frequencies[letter] = count / total;
    }

    return frequencies;
}

function prepareChartData(plaintext, expectedFrequencies) {
    const actual = getLetterFrequency(plaintext);
    const data = [];

    for (const letter of Object.keys(expectedFrequencies)) {
        data.push({
            letter,
            Očakávané: expectedFrequencies[letter],
            Reálne: actual[letter] || 0
        });
    }

    return data;
}

export function FrequencyChart({ plaintext }) {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (plaintext) {
            const data = prepareChartData(plaintext, expectedEnglishFrequencies);
            setChartData(data);
        }
    }, [plaintext]);

    if (!plaintext) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-custom-dark-blue text-center">
                Porovnanie frekvencií znakov
            </h3>
            <p className="text-sm text-custom-dark-blue text-center mb-4">
                Porovnanie medzi očakávanou a reálnou frekvenciou znakov vo výslednom texte.
            </p>
            <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="letter" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
                        <Legend />
                        <Bar dataKey="Očakávané" fill="#212D40" />
                        <Bar dataKey="Reálne" fill="#5EC9FF" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
