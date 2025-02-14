import express from 'express';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import authMiddleware from "../authMiddleware/authMiddleware.js";
import dotenv from "dotenv";
const router = express.Router();
dotenv.config();

// Temporary storage for email verification codes (You should use Redis/DB in production)
const verificationCodes = new Map();

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,  // false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Register user and send verification email
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Používateľ s rovnakým emailom už existuje." });
        }

        // Generate a random 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store the verification code temporarily (e.g., in memory)
        verificationCodes.set(email, verificationCode);
        //console.log("Email user:", process.env.EMAIL_USER, email);
        // Send verification email
        const mailOptions = {
            from: 'oliverspirczak@gmail.com',
            to: email,
            subject: "Verifikácia emailu",
            text: `Verifikačný kód: ${verificationCode}`
        };

        //console.log("Transporter config:", transporter);
        await transporter.sendMail(mailOptions);
        return res.json({ message: "Verifikáčný kód bol zaslaný na email." });
    } catch (err) {
        console.error("Error in /register route:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
});

// Verify email and complete registration
router.post('/verify-email', async (req, res) => {
    try {
        //console.log(req.body)
        const { email, verificationCode, firstName, lastName, password, role } = req.body;

        //console.log("Email:", email);
        //console.log("Verification Code:", verificationCode);
        //console.log("Verification Code:", verificationCodes.get(email));

        // Check if the code matches

        if (verificationCodes.get(email) !== verificationCode) {
            return res.status(400).json({ error: "Zlý verifikačný kód." });
        }

        // Remove verification code from storage
        verificationCodes.delete(email);

        // Create new user
        const newUser = new User({ firstName, lastName, email, password, role });
        await newUser.save();

        return res.json({ message: "Email bol verifikovaný! Registráciu bola úspešná." });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error." });
    }
});

// Update user name
router.put("/update-name", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the token (authMiddleware)
        const { firstName, lastName } = req.body;

        // Validate inputs
        if (!firstName || !lastName) {
            return res.status(400).json({ message: "First name and last name are required" });
        }

        // Update user in DB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName },
            { new: true, select: "-password" } // Return updated user without password
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating name:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
