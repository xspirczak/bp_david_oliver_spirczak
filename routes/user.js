import express from 'express';
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {isStrongPassword} from "../src/functions.js";
import bcrypt from "bcrypt";
const router = express.Router();
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'random';
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH || 'random1';

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
            process.env.JWT_SECRET,
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

        //console.log(req.body);

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Staré a nové heslá sú požadované" });
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

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Email alebo heslo je nesprávne.' });

        const userFullName = user.firstName + " " + user.lastName;
        // Generate JWT token
        const accessToken = jwt.sign({ id: user._id, email: user.email, fullName: userFullName }, JWT_SECRET, { expiresIn: '1h' });

        //console.log("TOKEN: ", accessToken);

        res.json({ message: 'Prihlásenie bolo úspešné', token: accessToken, user});
    } catch (err) {
        console.log("login error: ", err);

        res.status(500).json({ error: err.message });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) return res.status(404).json({ error: 'Používateľ sa nenašiel' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


export default router;
