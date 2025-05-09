/* global describe, it, expect */
import request from 'supertest';
import express from 'express';
import tutorialRoutes from '../tutorial.js';

import {
    decrypt,
    calculateCodebookMatches,
    calculateFrequencyScore
} from '../../src/utils/mappingUtils.js';

const app = express();
app.use(express.json());
app.use('/api/tutorial', tutorialRoutes);

describe('Tutorial Routes', () => {
    describe('POST /api/tutorial/decrypt', () => {
        it('should return decrypted result', async () => {
            const res = await request(app)
                .post('/api/tutorial/decrypt')
                .send({ text: 'test #1 #2', key: { TEST: '#1', DATA: '#2' } });

            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe(decrypt('test #1 #2', { TEST: '#1', DATA: '#2' }));
        });

        it('should return 400 if text or key is missing', async () => {
            const res = await request(app)
                .post('/api/tutorial/decrypt')
                .send({ text: 'test only' });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('POST /api/tutorial/calculate-matches', () => {
        it('should return match score', async () => {
            const res = await request(app)
                .post('/api/tutorial/calculate-matches')
                .send({ text: 'test #1', key: { TEST: '#1' } });

            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe(calculateCodebookMatches('test #1', { TEST: '#1' }));
        });

        it('should return 400 if missing parameters', async () => {
            const res = await request(app)
                .post('/api/tutorial/calculate-matches')
                .send({});

            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/tutorial/calculate-frequency-score', () => {
        it('should return frequency score', async () => {
            const res = await request(app)
                .post('/api/tutorial/calculate-frequency-score')
                .send({ plaintext: 'some text here' });

            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBeCloseTo(calculateFrequencyScore('some text here', 0.25));
        });

        it('should return 400 if no plaintext', async () => {
            const res = await request(app)
                .post('/api/tutorial/calculate-frequency-score')
                .send({});

            expect(res.statusCode).toBe(400);
        });
    });
});
