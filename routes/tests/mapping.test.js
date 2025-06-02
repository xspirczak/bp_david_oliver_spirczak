/* global describe, it, beforeAll, afterAll, expect */
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../server.js';
import User from '../../models/User.js';
import Key from '../../models/Keys.js';
import Text from '../../models/Text.js';

let token = '';
let testKey;
let testText;

describe('Mapping Routes', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        // Vytvorí nového testovacieho používateľa
        await User.deleteOne({ email: 'mapping@example.com' });
        await User.create({
            firstName: 'Map',
            lastName: 'Tester',
            email: 'mapping@example.com',
            password: 'Test123!',
            role: 'user'
        });

        const res = await request(app).post('/api/users').send({
            email: 'mapping@example.com',
            password: 'Test123!'
        });

        token = res.body.token;

        // Vytvorí nový testovací kľúč
        testKey = await Key.create({
            name: 'Test Key',
            description: 'Testing key mapping',
            country: 'SK',
            year: 1900,
            key: [["A", [1]], ["B", [2]]],
            uploadedBy: res.body.user._id
        });

        // Vytvorí nový testovací text
        testText = await Text.create({
            name: 'Test Text',
            description: 'Example cipher',
            country: 'SK',
            year: 1900,
            language: 'english',
            document: '#1 #2 test',
            uploadedBy: res.body.user._id
        });
    });

    afterAll(async () => {
        await User.deleteOne({ email: 'mapping@example.com' });
        await Key.deleteOne({ _id: testKey._id });
        await Text.deleteOne({ _id: testText._id });
        await mongoose.connection.close();
    });

    it('should return top 3 matching keys from ciphertext', async () => {
        const res = await request(app)
            .post('/api/mapping/ciphertext-to-key')
            .set('Authorization', `Bearer ${token}`)
            .send({
                ciphertext: '#1 #2 test',
                language: 'english',
                resultLimit: 3,
            });

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeLessThanOrEqual(3);
    });

    it('should return top 3 matching texts from key', async () => {
        const parsedKey = {
            A: [1],
            B: [2]
        };

        const res = await request(app)
            .post('/api/mapping/key-to-ciphertexts')
            .set('Authorization', `Bearer ${token}`)
            .send({ key: parsedKey, resultLimit: 3 });

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeLessThanOrEqual(3);
    });

    it('should return 400 if ciphertext is missing', async () => {
        const res = await request(app)
            .post('/api/mapping/ciphertext-to-key')
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(res.statusCode).toBe(400);
    });

    it('should return 400 if key is invalid JSON', async () => {
        const res = await request(app)
            .post('/api/mapping/key-to-ciphertexts')
            .set('Authorization', `Bearer ${token}`)
            .send({ key: 'invalid{json}' });

        expect(res.statusCode).toBe(400);
    });
});
