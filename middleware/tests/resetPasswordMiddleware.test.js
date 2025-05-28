/* global describe, it, expect */
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import resetPasswordMiddleware from "../resetPasswordMiddleware.js";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(express.json());

// Umelo-vytvorený route
app.post('/reset-password', resetPasswordMiddleware, (req, res) => {
    res.status(200).json({
        message: 'Authorized',
        user: req.user,
    });
});


describe('resetPasswordMiddleware', () => {
    it('should reject if no token is provided', async () => {
        const res = await request(app).post('/reset-password');
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Neautorizovaný prístup. Chýba token.");
    });

    it('should reject if token is invalid', async () => {
        const res = await request(app)
            .post('/reset-password')
            .set('Authorization', 'Bearer invalidtoken');

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Neplatný alebo expirovaný token.");
    });

    it('should authorize with valid token', async () => {
        const payload = {
            email: 'test@example.com',
            verificationCode: '123456',
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' });

        const res = await request(app)
            .post('/reset-password')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Authorized');
        expect(res.body.user).toMatchObject(payload);
    });
});
