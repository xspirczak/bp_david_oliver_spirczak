import express from 'express';
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {isStrongPassword} from "../src/utils/functions.js";
import bcrypt from "bcrypt";
const router = express.Router();
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);


router.put('/update-name', authMiddleware, async (req, res) => {
    try {
        const { firstName, lastName } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({ error: "Krstné meno a priezvisko sú povinné." });
        }

        // Find the user by ID (from middleware)
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "Používateľ sa nenašiel." });
        }

        // Generovanie nového JWT tokenu s aktualizovaným menom
        const newToken = jwt.sign(
            { id: updatedUser._id, email: updatedUser.email, fullName: `${updatedUser.firstName} ${updatedUser.lastName}` },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Name updated successfully", user: updatedUser, token: newToken});
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

router.put('/update-password', authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const provider = req.user.provider;

        if (provider === "google") {
            return res.status(401).json({ message: "Nemáte právo zmeniť heslo tohto používateľa." });
        }

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Staré a nové heslá sú povinné" });
        }

        const passwordError = isStrongPassword(newPassword);

        if (!passwordError.strong) {
            return res.status(400).json({ error: passwordError.error });
        }

        // Find user in the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "Používateľ sa nenašiel." });
        }

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Staré heslo je nesprávne." });
        }

        // Update the password
        user.password = newPassword;
        await user.save();

        res.json({ message: "Heslo bolo zmenené." });
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        //console.log(req.body);
        if (!email || !password) {
            return res.status(400).json({error: "Zadajte povinné údaje."})
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ error: 'Email alebo heslo je nesprávne.' });

        if (!user.password) {
            return res.status(400).json({error: 'Používateľ neexistuje.'})
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Email alebo heslo je nesprávne.' });

        const userFullName = user.firstName + " " + user.lastName;
        // Generate JWT token
        const accessToken = jwt.sign({ id: user._id, email: user.email, provider: user.provider, fullName: userFullName }, JWT_SECRET, { expiresIn: '1h' });

        //console.log("TOKEN: ", accessToken);

        res.json({ message: 'Prihlásenie bolo úspešné', token: accessToken, user});
    } catch (err) {
        console.log("login error: ", err);

        res.status(500).json({ error: err.message });
    }
});

router.post('/google-login', async(req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.VITE_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { email, given_name, family_name } = payload;

        let user = await User.findOne({ email });

        const fullName = given_name + " " + family_name;

        if (!user) {
            user = await User.create({
                email,
                firstName: given_name,
                lastName: family_name,
                provider: 'google',
                role: 'user',
            });
        }

        const appToken = jwt.sign(
            { id: user._id, email: user.email, provider: user.provider, fullName: fullName },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token: appToken });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(401).json({ message: 'Neplatný Google token' });
    }
})



router.get('/', authMiddleware, async (req, res) => {
    try {
        //console.log(req.user.id);
        const user = await User.findById(req.user.id).select('-password'); // Exclude password

        if (!user) return res.status(404).json({ error: 'Používateľ sa nenašiel' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});





export default router;
