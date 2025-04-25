/* global describe, it, expect, afterAll, beforeAll */
import {jest} from '@jest/globals';
import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';

jest.unstable_mockModule('nodemailer', () => ({
    default: {
        createTransport: () => ({
            sendMail: jest.fn().mockResolvedValue(true),
        }),
    },
}));

describe('Auth Routes', () => {
    const email = 'testauth@example.com';
    const password = 'Test123!';
    const name = {firstName: "Test", lastName: "Auth"};

    beforeAll(async () => {
        // Ensure MongoDB is connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        // Clean up if the user already exists
        await User.deleteOne({ email: 'testauth@example.com' });

        const testUser = await User.create({
            firstName: name.firstName,
            lastName: name.lastName,
            email: email,
            password: password,
            role: 'user',
        });
    });


    afterAll(async () => {
        await User.deleteOne({ email });
        await mongoose.connection.close();
    });

    /* Commented out so the email is not sent every time
    it('should send verification code on registration', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: "newemailauthtest@example.com",
            password,
            firstName: name.firstName,
            lastName: name.lastName,
            role: 'user',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Verifikáčný kód bol zaslaný/);
    });
    */
    it('should fail registration with missing fields', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email,
            password,
            firstName: name.firstName,
            role: 'user',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Zadajte všetky povinné polia/);
    });

    it('should fail registration with weak password', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: 'weak@example.com',
            password: '123',
            firstName: name.firstName,
            lastName: name.lastName,
            role: 'user',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Heslo musí obsahovať aspoň 6 znakov/);
    });

    it('should fail registration if email is already taken', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email,
            password,
            firstName: name.firstName,
            lastName: name.lastName,
            role: 'user',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Používateľ s rovnakým emailom už existuje/);
    });

    it('should fail email verification with wrong code', async () => {
        const res = await request(app).post('/api/auth/verify-email').send({
            email,
            verificationCode: '999999',
            firstName: name.firstName,
            lastName: name.lastName,
            password,
            role: 'user',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Zlý verifikačný kód/);
    });
});
