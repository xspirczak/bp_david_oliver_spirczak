import express from 'express';
const router = express.Router();
import {decrypt, calculateCodebookMatches, calculateFrequencyScore } from '../src/utils/mappingUtils.js';

// Dešifrovanie textu pomocou kľúča
router.post('/decrypt', async (req, res) => {
    const { text, key } = req.body;

    if (!text || !key) {
        return res.status(400).json({ error: 'Text a kľúč sú povinné.' });
    }

    try {
        const result = await decrypt(text, key);
        return res.json({ result });
    } catch (error) {
        console.error('Chyba pri dešifrovaní:', error);
        return res.status(500).json({ error: 'Chyba pri spracovaní dešifrovania.' });
    }
});

// Vypočet kódových zhôd medzi textom a kľúčom
router.post('/calculate-matches', async (req, res) => {
    const { text, key } = req.body;

    if (!text || !key) {
        return res.status(400).json({ error: 'Text a kľúč sú povinné.' });
    }

    try {
        const result = calculateCodebookMatches(text, key);

        return res.json({ result });
    } catch (error) {
        console.error('Chyba pri počítaní zhôd:', error);
        return res.status(500).json({ error: 'Chyba pri spracovaní počítanía zhôd.' });
    }
});

// Vypočeť skóre frekvenčnej analýzy
router.post('/calculate-frequency-score', async (req, res) => {
    const { plaintext } = req.body;

    if (!plaintext) {
        return res.status(400).json({ error: 'Text je povinný.' });
    }

    try {
        const result = await calculateFrequencyScore(plaintext);
        return res.json({ result });
    } catch (error) {
        console.error('Chyba pri frekvenčnej analyze:', error);
        return res.status(500).json({ error: 'Chyba pri spracovaní frekvenčnej analyzy.' });
    }
});

// Vykonanie krokov (decrypt, calculateCodebookMatches a calculateFrequencyScore) naraz
router.post('/combined-mapping', async (req, res) => {
    const { direction, mappedObject, mappedObjects} = req.body;

    if (!mappedObject && !mappedObjects) {
        return res.status(400).json({error: 'Dokumenty nie sú zadané.'})
    }

    if (direction === "textToKey") {
        const results = await Promise.all(mappedObjects.map(async (key) => {
            const plaintext = decrypt(mappedObject, key.mapping);
            const codebookScore = calculateCodebookMatches(mappedObject, key.mapping);
            return { key: key.mapping,plaintext, score: codebookScore };
        }));

        const finalResults = await Promise.all(results.map(async (key) => {
            const freqScore = calculateFrequencyScore(key.plaintext);

            const totalScore = 0.5 * key.score + 0.5 * freqScore;

            return {content: key.key, plaintext: key.plaintext, score: totalScore};
        }));

        const final = finalResults
            .sort((a, b) => b.score - a.score)
            .slice(0, 1);

        res.json(final[0]);

    } else if (direction === "keyToText") {
        const results = await Promise.all(mappedObjects.map(async (doc) => {
            const plaintext = decrypt(doc.content, mappedObject);
            const codebookScore = calculateCodebookMatches(doc.content, mappedObject);

            return {content: doc.content, plaintext, score: codebookScore };
        }));

        const finalResults = await Promise.all(results.map(async (doc) => {
            const freqScore = calculateFrequencyScore(doc.plaintext);

            const totalScore = 0.5 * doc.score + 0.5 * freqScore;

            return {content: doc.content, plaintext: doc.plaintext, score: totalScore};
        }));


        const final = finalResults
            .sort((a, b) => b.score - a.score)
            .slice(0, 1);

        res.json(final[0])
    } else {
        return res.status(400).json({error: 'Nesprávny smer vyhľadávania.'})
    }
});



export default router;
