/* global describe, it, beforeAll, afterAll, expect */
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../server.js';
import User from '../../models/User.js';

let token;
let docId;

describe('Texts Routes', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        await User.deleteOne({ email: 'texttest@example.com' });
        const testUser = await User.create({
            firstName: 'Text',
            lastName: 'Tester',
            email: 'texttest@example.com',
            password: 'Test123!',
            role: 'user',
        });

        const res = await request(app).post('/api/users').send({
            email: 'texttest@example.com',
            password: 'Test123!'
        });

        token = res.body.token;
    });

    afterAll(async () => {
        await User.deleteOne({ email: 'texttest@example.com' });
        await mongoose.connection.close();
    });

    it('should create a new text document', async () => {
        const res = await request(app)
            .post('/api/texts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Document',
                description: 'Test Description',
                language: 'en',
                country: 'Test Country',
                year: 2000,
                document: '#1 #2 test'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Test Document');
        docId = res.body._id;
    });

    it('should fail creating a new text document without text body', async () => {
        const res = await request(app)
            .post('/api/texts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Document',
                description: 'Test Description',
                language: 'en',
                country: 'Test Country',
                year: 2000,
            });

        expect(res.statusCode).toBe(400);
    });

    it('should fail creating a new text document with empty text body', async () => {
        const res = await request(app)
            .post('/api/texts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Document',
                description: 'Test Description',
                language: 'en',
                country: 'Test Country',
                year: 2000,
                document: ''
            });

        expect(res.statusCode).toBe(400);
    });

    it('should fetch all documents', async () => {
        const res = await request(app)
            .get('/api/texts')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.documents)).toBe(true);
    });

    it('should update a document', async () => {
        const res = await request(app)
            .put(`/api/texts/${docId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Name',
                description: 'Updated Description',
                language: 'sk',
                country: 'Slovakia',
                year: 2024,
                document: '#3 #4 updated'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/úspešne zmenený/);
    });

    it('should fail updating a document with invalid id', async () => {
        const wrongId = -1
        const res = await request(app)
            .put(`/api/texts/${wrongId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Name',
                description: 'Updated Description',
                language: 'sk',
                country: 'Slovakia',
                year: 2024,
                document: '#3 #4 updated'
            });

        expect(res.statusCode).toBe(400);
    });

    it('should fail updating a document with non-existent id', async () => {
        const wrongId = '67b1e50622d80850caef28fb';
        const res = await request(app)
            .put(`/api/texts/${wrongId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Name',
                description: 'Updated Description',
                language: 'sk',
                country: 'Slovakia',
                year: 2024,
                document: '#3 #4 updated'
            });

        expect(res.statusCode).toBe(404);
    });

    it('should fail updating a document without id', async () => {
        const wrongId = null;
        const res = await request(app)
            .put(`/api/texts/${wrongId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Name',
                description: 'Updated Description',
                language: 'sk',
                country: 'Slovakia',
                year: 2024,
                document: '#3 #4 updated'
            });

        expect(res.statusCode).toBe(400);
    });

    it('should delete a document', async () => {
        const res = await request(app)
            .delete(`/api/texts/${docId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/úspešne vymazaný/);
    });

    it('should fail deleting a document with invalid id', async () => {
        const wrongId = 1;
        const res = await request(app)
            .delete(`/api/texts/${wrongId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(400);
    });

    it('should fail deleting a document with non-existent id', async () => {
        const wrongId = '67b1e50622d80850caef28fb';
        const res = await request(app)
            .delete(`/api/texts/${wrongId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
    });

    it('should fail deleting a document without id', async () => {
        const wrongId = '';
        const res = await request(app)
            .delete(`/api/texts/${wrongId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
    });
});
