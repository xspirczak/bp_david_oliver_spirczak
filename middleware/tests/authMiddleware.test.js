/* global describe, it, expect */
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import authMiddleware from "../authMiddleware.js";

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(express.json());

// Mock GET požiadavka
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Prístup povolený', user: req.user });
});

describe('authMiddleware', () => {
    it('should deny access if no token is provided', async () => {
        const res = await request(app).get('/protected');
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Prístup zamietnutý. Token nebol poskytnutý.');
    });

    it('should deny access if token is invalid', async () => {
        const res = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer invalidtoken');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Nesprávny alebo neplatný token.');
    });

    it('should allow access with valid token', async () => {
        const user = { id: '12345', email: 'test@example.com' };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

        const res = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Access granted');
        expect(res.body.user).toMatchObject(user);
    });
});
