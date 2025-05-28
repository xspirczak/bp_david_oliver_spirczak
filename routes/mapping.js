import express from 'express';
const router = express.Router();
import Key from '../models/Keys.js';
import Text from '../models/Text.js';
import authMiddleware from "../middleware/authMiddleware.js";
import {decrypt, calculateCodebookMatches, calculateFrequencyScore } from '../src/utils/mappingUtils.js';

//  Mapovanie šifrovaného textu na kľúče (počet zhôd (vyberie top 5) následne z top 5 vyberie top 3 na základe frekvečnej analýzy)
router.post('/ciphertext-to-key', authMiddleware, async (req, res) => {
    console.time('serial-ciphertext-to-key'); // Začni meranie času

    try {
        const { ciphertext, language } = req.body;
        if (!ciphertext) return res.status(400).json({ message: 'Šifrovaný text je povinný' });

        // Všetky kľúče
        const keys = await Key.find();
        if (!keys.length) return res.status(404).json({ message: 'Žiadne kľúče nenájdené' });

        // Pre každý kľúč z DB
        const results = await Promise.all(keys.map(async (key) => {
            // Rozparsuje kľúč
            const keyObject = Object.fromEntries(key.key);
            // Dešifrovanie textu pomocou kľúča
            const plaintext = decrypt(ciphertext, keyObject);
            // Vypočeť zhôd kódov medzi textom a kľúčom
            const codebookScore = calculateCodebookMatches(ciphertext, keyObject);
            return { keyId: key._id, plaintext, score: codebookScore };
        }));


        // Vyberie najlepších 5 výsledkov
        const top5Matches = results
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);


        // Pre Top 5 výsledkov
        const finalResults = await Promise.all(top5Matches.map(async (key) => {
            // Vypočíta frekvenčné skóre
            const freqScore = calculateFrequencyScore(key.plaintext, language);

            const totalScore = 0.5 * key.score + 0.5 * freqScore;

            return {keyId: key.keyId, plaintext: key.plaintext, score: totalScore};
        }));

        // Vyberie 3 najlepšie výsledky
        const final = finalResults
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        console.timeEnd('serial-ciphertext-to-key'); // Ukonči meranie času

        res.json(final);
    } catch (error) {
        console.timeEnd('serial-ciphertext-to-key'); // Ukonči meranie aj pri chybe

        res.status(500).json({ message: 'Chyba pri vyhľadávaní', error: error.message });
    }
});



//  Mapovanie šifrovacieho kľúča na texty (počet zhôd (vyberie top 5) následne z top 5 vyberie top 3 na základe frekvečnej analýzy)
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
                return res.status(400).json({ message: 'Kľúč nie je platný JSON formát', error: error.message });
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
            // Dešfifrovanie textu pomocou kľúča
            const plaintext = decrypt(doc.document, key);
            // Vypočeť zhôd kódov medzi textom a kľúčom
            const codebookScore = calculateCodebookMatches(doc.document, key);
            return { docId: doc._id, plaintext, score: codebookScore, language: doc.language, document: doc.document };
        }));

        // Vyberie najlepších 5 výsledkov
        const top5Matches = results
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        // Pre Top 5 výsledkov
        const finalResults = await Promise.all(top5Matches.map(async (doc) => {
            // Vypočíta frekvenčné skóre
            const freqScore = calculateFrequencyScore(doc.plaintext, doc.language);

            const totalScore = 0.5 * doc.score + 0.5 * freqScore;

            return {docId: doc.docId, plaintext: doc.plaintext, score: totalScore, document: doc.document};
        }));

        // Vyberie 3 najlepšie výsledky
        const final = finalResults
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
        console.timeEnd('serial-key-to-ciphertexts');
        res.json(final);
    } catch (error) {
        console.timeEnd('serial-key-to-ciphertexts');
        res.status(500).json({ message: 'Chyba pri vyhľadávaní', error: error.message });
    }
});

export default router;