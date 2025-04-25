/* global describe, it, expect, beforeAll, afterAll */
import request from 'supertest';
import app from '../../server.js';
import mongoose from 'mongoose';
import User from '../../models/User.js';

describe('User Routes', () => {
    it('should return 400 if email or password is missing on login', async () => {
        const res = await request(app).post('/api/users').send({ email: '' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Zadajte povinné údaje.");
    });

    it('should return 400 for incorrect credentials', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ email: 'wrong@example.com', password: 'wrong' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Email alebo heslo je nesprávne.');
    });


    // Vytvorenie testovacieho používateľa
    let token = '';
    const password = 'Test123!'
    const name = {firstName: "Test", lastName: "User"};
    const email = 'testuser@example.com';

    beforeAll(async () => {
        // Ensure MongoDB is connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        // Clean up if the user already exists
        await User.deleteOne({ email: 'testuser@example.com' });

        const testUser = await User.create({
            firstName: name.firstName,
            lastName: name.lastName,
            email: email,
            password: password,
            role: 'user',
        });

        // Now login to get the token
        const res = await request(app)
            .post('/api/users')
            .send({ email: 'testuser@example.com', password: 'Test123!' });

        token = res.body.token;
    });

    it('should login successfully with correct credentials', async () => {
        const testUser = {
            email: email,
            password: password
        };

        const res = await request(app)
            .post('/api/users')
            .send(testUser);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe(testUser.email);
    });


    it('should return user profile with valid token', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('email');
        expect(res.body.email).toBe('testuser@example.com');
    });

    it('should return 401 with invalid token', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer invalidtoken123`);

        expect(res.statusCode).toBe(401);
    });

    it('should return 401 with missing token', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(401);
    });

    it('should update user name successfully', async () => {
        const res = await request(app)
            .put('/api/users/update-name')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: 'Updated', lastName: 'User' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.firstName).toBe('Updated');
    });


    it('should return 400 when trying to update name with missing fields', async () => {
        const res = await request(app)
            .put('/api/users/update-name')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: '', lastName: '' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Krstné meno a priezvisko sú povinné.');
    });

    it('should fail to change password with incorrect old password', async () => {
        const res = await request(app)
            .put('/api/users/update-password')
            .set('Authorization', `Bearer ${token}`)
            .send({ oldPassword: 'WrongOldPass', newPassword: 'NewPass123!' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Staré heslo je nesprávne.');
    });

    it('should fail to change password with weak new password', async () => {
        const res = await request(app)
            .put('/api/users/update-password')
            .set('Authorization', `Bearer ${token}`)
            .send({ oldPassword: password, newPassword: 'abc' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Heslo musí obsahovať/);
    });

    it('should successfully change password', async () => {
        const res = await request(app)
            .put('/api/users/update-password')
            .set('Authorization', `Bearer ${token}`)
            .send({ oldPassword: password, newPassword: 'StrongPass1!' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Heslo bolo zmenené.');
    });

    afterAll(async () => {
         await User.deleteOne({ email: 'testuser@example.com' }); // Vymazanie testovacieho používateľa
        await mongoose.connection.close(); // // Zatvor MongoDB konekciu
    });
});


