/* global describe, it, expect, beforeAll, afterAll */
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../server.js';
import User from '../../models/User.js';
import Key from '../../models/Keys.js';

let token;
let keyId1;
let keyId2;

let userId;

describe('Keys Routes', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        await User.deleteOne({ email: 'keytest@example.com' });

        await User.create({
            firstName: 'Key',
            lastName: 'Tester',
            email: 'keytest@example.com',
            password: 'Test123!',
            role: 'user',
        });

        const res = await request(app)
            .post('/api/users')
            .send({ email: 'keytest@example.com', password: 'Test123!' });

        token = res.body.token;
        userId = res.body.user._id;
    });

    afterAll(async () => {
        await User.deleteOne({ email: 'keytest@example.com' });
        await Key.deleteOne({_id: keyId1});
        await Key.deleteOne({_id: keyId2});
        await mongoose.connection.close();
    });

    it('should create a new key with token', async () => {
        const key = {
            A: [1, 2],
            B: [3]
        };

        const res = await request(app)
            .post('/api/keys')
            .set('Authorization', `Bearer ${token}`)
            .send({
                key,
                name: 'Test Key',
                description: 'Test Description',
                country: 'Test Country',
                year: 2000
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Test Key');
        expect(res.body.uploadedBy).toBe(userId);
        keyId1 = res.body._id;
    });


    it('should create a new key no token', async () => {
        const key = {
            A: [1, 2],
            B: [3]
        };

        const res = await request(app)
            .post('/api/keys')
            .send({
                key,
                name: 'Test Key',
                description: 'Test Description',
                country: 'Test Country',
                year: 2000
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Test Key');
        expect(res.body.uploadedBy).toBe(null);
        keyId2 = res.body._id;
    });

    it('should not create new key with duplicates', async () => {
        const key = {
            A: [1, 2],
            B: [1]
        };

        const res = await request(app)
            .post('/api/keys')
            .send({
                key,
                name: 'Test Key',
                description: 'Test Description',
                country: 'Test Country',
                year: 2000
            });

        expect(res.statusCode).toBe(400);
    });

    it('should not create new key without key body', async () => {
        const res = await request(app)
            .post('/api/keys')
            .send({
                name: 'Test Key',
                description: 'Test Description',
                country: 'Test Country',
                year: 2000
            });

        expect(res.statusCode).toBe(400);
    });

    it('should fetch all keys', async () => {
        const res = await request(app).get('/api/keys');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should fetch a key by ID', async () => {
        const res = await request(app).get(`/api/keys/${keyId1}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.key).toHaveProperty('_id');
    });

    it('should return 400 on invalid ID', async () => {
        const res = await request(app)
            .get('/api/keys/123')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
    });

    it('should return 400 for unset id', async () => {
        const wrongId = null
        const res = await request(app).get(`/api/keys/${wrongId}`);
        expect(res.statusCode).toBe(400);
    });

    it('should return 404 on non-existent ID', async () => {
        const res = await request(app)
            .get('/api/keys/64b1e50622d80850caef28fb')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
    });

    it('should update a key', async () => {
        const key = {
            A: [5],
            B: [6]
        };

        const res = await request(app)
            .put(`/api/keys/${keyId1}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Key',
                description: 'Updated Desc',
                language: 'en',
                country: 'SK',
                year: 2024,
                key: JSON.stringify(key),
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.key.name).toBe('Updated Key');
    });

    it('should not update a key without valid token', async () => {
        const key = {
            A: [5],
            B: [6]
        };

        const res = await request(app)
            .put(`/api/keys/${keyId1}`)
            .send({
                name: 'Updated Key',
                description: 'Updated Desc',
                language: 'en',
                country: 'SK',
                year: 2024,
                key: JSON.stringify(key),
            });

        expect(res.statusCode).toBe(401);
    });

    it('should not update a key without key body', async () => {
        const res = await request(app)
            .put(`/api/keys/${keyId1}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Key',
                description: 'Updated Desc',
                language: 'en',
                country: 'SK',
                year: 2024,
            });

        expect(res.statusCode).toBe(400);
    });

    it('should not update key with duplicate codes', async () => {
        const key = {
            A: [1, 2],
            B: [2]
        };

        const res = await request(app)
            .put(`/api/keys/${keyId1}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Invalid Key',
                description: 'Dup test',
                language: 'en',
                country: 'SK',
                year: 2024,
                key: JSON.stringify(key),
            });

        expect(res.statusCode).toBe(400);
    });

    it('should not delete a key without id', async () => {
        const res = await request(app)
            .delete(`/api/keys`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
    });


    it('should not delete a key with invalid id', async () => {
        const res = await request(app)
            .delete(`/api/keys/123`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(400);
    });


    it('should delete a key', async () => {
        const res = await request(app)
            .delete(`/api/keys/${keyId1}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/úspešne vymazaný/);
    });
});


