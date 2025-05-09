import express from 'express';
const router = express.Router();
import {decrypt, calculateCodebookMatches, calculateFrequencyScore } from '../src/utils/mappingUtils.js';

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


export default router;
