import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frequenciesPath = path.join(__dirname, '../data/letterFrequency.json');

let frequencies = null;

try {
    const data = await readFile(frequenciesPath, 'utf-8');
    frequencies = JSON.parse(data);
} catch (err) {
    console.error('Chyba pri načítaní frequencies JSON:', err.message);
}
/*-----------------------------------*/

export function decrypt(ciphertext, key) {
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

export function calculateCodebookMatches(ciphertext, key) {
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

export function calculateFrequencyScore(plaintext, language = null) {
    const freq = {};
    for (const char of plaintext.toLowerCase()) {
        if (/[a-z]/.test(char)) freq[char] = (freq[char] || 0) + 1;
    }

    const total = Object.values(freq).reduce((a, b) => a + b, 0);
    if (total === 0) return 0;

    const expected = frequencies.languages[language] || frequencies.languages['english'];

    // skutočná frekvencia znakov v texte, normalizovaná (delená celkovým počtom znakov)
    const observedVector = [];
    // typická frekvencia znakov pre jazyk
    const expectedVector = [];

    for (const letter of Object.keys(expected)) {
        observedVector.push((freq[letter] || 0) / total);
        expectedVector.push(expected[letter]);
    }

    // Kosínusová podobnosť
    // Skalárny súčin
    const dot = observedVector.reduce((sum, val, i) => sum + val * expectedVector[i], 0);
    // Vypočítanie veľkostí (magnitúd) oboch vektorov
    const mag1 = Math.sqrt(observedVector.reduce((sum, val) => sum + val ** 2, 0));
    const mag2 = Math.sqrt(expectedVector.reduce((sum, val) => sum + val ** 2, 0));

    // Ak je niektorý vektor nulový -> 0
    if (mag1 === 0 || mag2 === 0) return 0;

    return dot / (mag1 * mag2);
}
