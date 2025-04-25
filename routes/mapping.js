import express from 'express';
const router = express.Router();
import Key from '../models/Keys.js';
import Text from '../models/Text.js';
import authMiddleware from "../middleware/authMiddleware.js";
import {decrypt, calculateCodebookMatches, calculateFrequencyScore } from '../src/utils/mappingUtils.js';

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

        const finalResults = await Promise.all(top5Matches.map(async (key) => {
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
            const plaintext = decrypt(doc.document, key);
            const codebookScore = calculateCodebookMatches(doc.document, key);
            return { docId: doc._id, plaintext, score: codebookScore, language: doc.language };
        }));

        const top5Matches = results
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);


        const finalResults = await Promise.all(top5Matches.map(async (doc) => {
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

export default router;