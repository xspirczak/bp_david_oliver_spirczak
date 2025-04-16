import express from 'express';
const router = express.Router();
import Key from '../models/Keys.js';
import Text from '../models/Text.js';
import authMiddleware from "../middleware/authMiddleware.js";
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frequenciesPath = path.join(__dirname, '../src/data/letterFrenquency.json');

let frequencies = null;

try {
    const data = await readFile(frequenciesPath, 'utf-8');
    frequencies = JSON.parse(data);
} catch (err) {
    console.error('Chyba pri načítaní frequencies JSON:', err.message);
}
/*-----------------------------------*/


function decrypt(ciphertext, key) {
    // Rozdeľ šifrovaný text na slová podľa medzier
    const words = ciphertext.trim().split(' ');
    const plaintext = [];

    for (const word of words) {
        let decryptedWord = '';
        // Rozdeľ slovo na časti začínajúce '#' a ostatné
        const parts = word.split(/(#[0-9]+)/).filter(Boolean); // Rozdelí na kódy a plaintext

        for (const part of parts) {
            if (part.startsWith('#')) {
                // Je to kód, pokús sa ho dešifrovať
                const code = parseInt(part.replace('#', ''));
                let found = false;
                for (const [entry, codeList] of Object.entries(key)) {
                    if (codeList.includes(code)) {
                        decryptedWord += entry;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    decryptedWord += `#${code}`; // Ak kód nie je v kľúči, ponechaj ho
                }
            } else {
                // Nie je to kód, je to plaintext – ponechaj nezmenené
                decryptedWord += part;
            }
        }
        plaintext.push(decryptedWord);
    }

    return plaintext.join(' ');
}

function calculateCodebookMatches(ciphertext, key) {
    const words = ciphertext.split(' ');
    let matches = 0;
    let totalCodes = 0;

    for (const word of words) {
        if (word.includes('#')) {
            const codes = word.split('#').filter(Boolean); // Rozdeľ na kódy
            totalCodes += codes.length; // Počítaj všetky kódy v slove

            for (const code of codes) {
                const numCode = parseInt(code);
                for (const codeList of Object.values(key)) {
                    if (codeList.includes(numCode)) {
                        matches++;
                        break; // Zhoda nájdená, preskoč na ďalší kód
                    }
                }
            }
        }
    }

    return totalCodes > 0 ? matches / totalCodes : 0; // Normalizované skóre (0-1)
}

function calculateFrequencyScore(plaintext, language = null) {
    const freq = {};
    for (const char of plaintext.toLowerCase()) {
        if (/[a-z]/.test(char)) freq[char] = (freq[char] || 0) + 1;
    }
    const total = Object.values(freq).reduce((a, b) => a + b, 0) || 1;

    let expected;
    if (language && frequencies.languages[language]) {
        expected = frequencies.languages[language];
    } else {
        expected = frequencies.languages.english;
    }

    let score = 0;
    for (const [letter, expFreq] of Object.entries(expected)) {
        const obsFreq = (freq[letter] || 0) / total;
        score += Math.abs(expFreq - obsFreq);
    }

    const normalizedScore = Math.max(0, 1 - Math.min(score, 1));
    return normalizedScore;
}

//  Mapovanie šifrovaného textu na kľúč (počet zhôd (vyberie top 5) následne na top 5 frekvečná analýza)
router.post('/ciphertext-to-key', authMiddleware, async (req, res) => {
    console.time('serial-ciphertext-to-key'); // Začni meranie času

    try {
        const { ciphertext, language } = req.body;
        if (!ciphertext) return res.status(400).json({ message: 'Šifrovaný text je povinný' });

        const keys = await Key.find();
        if (!keys.length) return res.status(404).json({ message: 'Žiadne kľúče nenájdené' });

        const results = await Promise.all(keys.map(async (key) => {
            const keyObject = Object.fromEntries(key.key);
            const plaintext = decrypt(ciphertext, keyObject);
            const codebookScore = calculateCodebookMatches(ciphertext, keyObject);
            return { keyId: key._id, plaintext, score: codebookScore };
        }));

        //console.log("Results after first step:", JSON.stringify(results));

        const top5Matches = results
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        //console.log("Top 5 results after first step:", JSON.stringify(top5Matches));

        const finalResults = await Promise.all(top5Matches.map(async (key, idx) => {
            const freqScore = calculateFrequencyScore(key.plaintext, language);

            const totalScore = 0.5 * key.score + 0.5 * freqScore;
            //console.log("key at" , idx, "code match: ", key.score, " freq score: ", freqScore )

            return {keyId: key.keyId, plaintext: key.plaintext, score: totalScore};
        }));

        const final = finalResults
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        //console.log("Top 3 final results after second step:", JSON.stringify(final));
        console.timeEnd('serial-ciphertext-to-key'); // Ukonči meranie času

        res.json(final);
    } catch (error) {
        console.timeEnd('serial-ciphertext-to-key'); // Ukonči meranie aj pri chybe

        res.status(500).json({ message: 'Chyba pri mapovaní', error: error.message });
    }
});



// Key to text mapping (steps separated)
router.post('/key-to-ciphertexts', authMiddleware, async (req, res) => {
    console.time('serial-key-to-ciphertexts');

    try {
        let { key } = req.body;
        if (!key) return res.status(400).json({ message: 'Kľúč je povinný' });

        // Ak je key reťazec, pokús sa ho parsovať na objekt
        if (typeof key === 'string') {
            try {
                key = JSON.parse(key);
            } catch (error) {
                return res.status(400).json({ message: 'Kľúč nie je platný JSON formát' });
            }
        }

        // Over, či je kľúč platný objekt
        if (typeof key !== 'object' || key === null || Array.isArray(key)) {
            return res.status(400).json({ message: 'Kľúč musí byť platný JSON objekt' });
        }

        // Načítaj všetky šifrované texty
        const documents = await Text.find();
        if (!documents.length) return res.status(404).json({ message: 'Žiadne dokumenty nenájdené' });

        // Pre každý dokument vypočítaj skóre
        const results = await Promise.all(documents.map(async (doc) => {
            const plaintext = decrypt(doc.document, key);
            const codebookScore = calculateCodebookMatches(doc.document, key);
            return { docId: doc._id, plaintext, score: codebookScore, language: doc.language };
        }));

        const top5Matches = results
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);


        const finalResults = await Promise.all(top5Matches.map(async (doc, idx) => {
            const freqScore = calculateFrequencyScore(doc.plaintext, doc.language);

            const totalScore = 0.5 * doc.score + 0.5 * freqScore;
            //console.log("doc at" , idx, "code match: ", key.score, " freq score: ", freqScore )

            return {docId: doc.docId, plaintext: doc.plaintext, score: totalScore};
        }));

        const final = finalResults
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
        console.timeEnd('serial-key-to-ciphertexts');
        res.json(final);
    } catch (error) {
        console.timeEnd('serial-key-to-ciphertexts');
        res.status(500).json({ message: 'Chyba pri mapovaní', error: error.message });
    }
});


/*
// Mapovanie šifrovaného textu na kľúč (počet zhôd a frekvečná analýza pre všetky kľúče)

router.post('/ciphertext-to-key', authMiddleware, async (req, res) => {
        console.time('combined-ciphertext-to-keys');

    try {
        const { ciphertext } = req.body;
        if (!ciphertext) return res.status(400).json({ message: 'Šifrovaný text je povinný' });

        const keys = await Key.find();
        if (!keys.length) return res.status(404).json({ message: 'Žiadne kľúče nenájdené' });

        const results = await Promise.all(keys.map(async (key) => {
            const keyObject = Object.fromEntries(key.key);
            const plaintext = decrypt(ciphertext, keyObject);
            const codebookScore = calculateCodebookMatches(ciphertext, keyObject);
            const freqScore = calculateFrequencyScore(plaintext);
            const totalScore = 0.5 * codebookScore + 0.5 * freqScore;

            return { keyId: key._id, plaintext, score: totalScore };
        }));

        const topMatches = results
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
        console.timeEnd('combined-ciphertext-to-keys');

        res.json(topMatches);
    } catch (error) {
        console.timeEnd('combined-ciphertext-to-keys');

        res.status(500).json({ message: 'Chyba pri mapovaní', error: error.message });
    }
});


// Key to text mapping (both methods together)

router.post('/key-to-ciphertexts', authMiddleware, async (req, res) => {
    console.time('combined-key-to-ciphertexts');

    try {
        let { key } = req.body;
        if (!key) return res.status(400).json({ message: 'Kľúč je povinný' });

        // Ak je key reťazec, pokús sa ho parsovať na objekt
        if (typeof key === 'string') {
            try {
                key = JSON.parse(key);
            } catch (error) {
                return res.status(400).json({ message: 'Kľúč nie je platný JSON formát' });
            }
        }

        // Over, či je kľúč platný objekt
        if (typeof key !== 'object' || key === null || Array.isArray(key)) {
            return res.status(400).json({ message: 'Kľúč musí byť platný JSON objekt' });
        }

        // Načítaj všetky šifrované texty
        const documents = await Text.find();
        if (!documents.length) return res.status(404).json({ message: 'Žiadne dokumenty nenájdené' });

        // Pre každý dokument vypočítaj skóre
        const results = await Promise.all(documents.map(async (doc) => {
            const plaintext = decrypt(doc.document, key);
            const codebookScore = calculateCodebookMatches(doc.document, key);
            const freqScore = calculateFrequencyScore(plaintext);
            const totalScore = 0.5 * codebookScore + 0.5 * freqScore;
            return { docId: doc._id, plaintext, score: totalScore };
        }));

        // final results
        const topMatches = results
            .sort((a, b) => b.score - a.score)
            .slice(0, 3); // Vráti prvé 3 výsledky (alebo menej, ak ich je menej)

        res.json(topMatches);
        console.timeEnd('combined-key-to-ciphertexts');

    } catch (error) {
        console.timeEnd('combined-key-to-ciphertexts');

        res.status(500).json({ message: 'Chyba pri mapovaní', error: error.message });
    }
});

*/

export default router;