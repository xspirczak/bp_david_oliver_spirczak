/* global describe, it, expect */
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import tokenExistsMiddleware from "../tokenExistsMiddleware.js";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Express App
const app = express();
app.use(express.json());

// Umelovytvorený route
app.get('/check-token', tokenExistsMiddleware, (req, res) => {
    res.status(200).json({
        hasUser: !!req.user,
        user: req.user,
    });
});

describe('tokenExistsMiddleware', () => {
    it('should set req.user to null if no token is provided', async () => {
        const res = await request(app).get('/check-token');
        expect(res.statusCode).toBe(200);
        expect(res.body.hasUser).toBe(false);
        expect(res.body.user).toBe(null);
    });

    it('should set req.user to null if token is invalid', async () => {
        const res = await request(app)
            .get('/check-token')
            .set('Authorization', 'Bearer invalidtoken');

        expect(res.statusCode).toBe(200);
        expect(res.body.hasUser).toBe(false);
        expect(res.body.user).toBe(null);
    });

    it('should set req.user if token is valid', async () => {
        const payload = { id: '12345' };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' });

        const res = await request(app)
            .get('/check-token')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.hasUser).toBe(true);
        expect(res.body.user).toEqual(payload);
    });
});
