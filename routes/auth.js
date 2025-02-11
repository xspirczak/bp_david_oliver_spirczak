import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';  // Ensure User model is correct

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'random';

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Vyplnte povinné polia.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Použivateľ s emailom už existuje.' });
        }

        /* Don't need this because I already hash the password in schema
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        */

        const newUser = new User({ firstName, lastName, email, password: password, role });
        await newUser.save();

        // Generate token
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
