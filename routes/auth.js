import express from 'express';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import authMiddleware from "../authMiddleware/authMiddleware.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {isStrongPassword} from "../src/functions.js";
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

        const passwordError = isStrongPassword(password);

        if (!passwordError.strong) {
            return res.status(400).json({ error: passwordError.error });
        }

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

// Temporary storage for email change verification codes
const emailChangeVerificationCodes = new Map();


//Request Email Change (Send Verification Code)
router.post("/request-email-change", authMiddleware, async (req, res) => {
    try {
        const { newEmail } = req.body;
        const userId = req.user.id; // Extract user ID from the token

        // Check if the new email is already in use
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ error: "Email už existuje." });
        }

        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        emailChangeVerificationCodes.set(userId, { newEmail, verificationCode, expiresAt: Date.now() + 10 * 60 * 1000 });

        // Send email with verification code
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newEmail,
            subject: "Overenie zmeny emailu",
            text: `Váš overovací kód: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);
        return res.json({ message: "Overovací kód bol odoslaný na nový email." });

    } catch (err) {
        console.error("Chyba pri odosielaní overovacieho kódu:", err);
        return res.status(500).json({ error: "Interná chyba servera." });
    }
});


// Verify Code and Update Email
router.post("/verify-email-change", authMiddleware, async (req, res) => {
    try {
        const { verificationCode } = req.body;
        const userId = req.user.id;

        // Get stored verification code
        const storedData = emailChangeVerificationCodes.get(userId);
        if (!storedData || storedData.expiresAt < Date.now()) {
            return res.status(400).json({ error: "Overovací kód vypršal alebo neexistuje." });
        }

        if (storedData.verificationCode !== verificationCode) {
            return res.status(400).json({ error: "Nesprávny overovací kód." });
        }

        // Update the user's email
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { email: storedData.newEmail },
            { new: true }
        );


        const userFullName = updatedUser.firstName + " "  + updatedUser.lastName;

        if (!updatedUser) {
            return res.status(404).json({ error: "Používateľ sa nenašiel." });
        }

        // Generate a new JWT token with the updated email
        const newAccessToken = jwt.sign(
            { id: updatedUser._id, email: updatedUser.email, fullName: userFullName },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Remove the stored code after successful update
        emailChangeVerificationCodes.delete(userId);

        return res.json({
            message: "Email bol úspešne zmenený.",
            token: newAccessToken,  // Send the new token
            user: updatedUser
        });

    } catch (err) {
        console.error("Chyba pri overovaní emailu:", err);
        return res.status(500).json({ error: "Interná chyba servera." });
    }
});

// Forgot password request verification code
router.post("/forgot-password",  async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email is used
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ error: "Používateľ s týmto emailom neexistuje." });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store the code in memory (or database) with an expiration time
        emailChangeVerificationCodes.set(email, {
            verificationCode,
            expiresAt: Date.now() + 10 * 60 * 1000, // Code valid for 10 minutes
        });

        // Send email with verification code
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Obnova hesla",
            text: `Váš overovací kód na obnovanie hesla: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);
        return res.json({ message: "Overovací kód bol odoslaný na nový email." });

    } catch (err) {
        console.error("Chyba pri odosielaní overovacieho kódu:", err);
        return res.status(500).json({ error: "Interná chyba servera." });
    }
});

// Verify the password reset code
router.post("/forgot-password-verify-code", async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        // Check if a verification code exists for this email
        const storedData = emailChangeVerificationCodes.get(email);
        if (!storedData) {
            return res.status(400).json({ error: "Nebolo nájdené overenie pre tento email." });
        }

        // Check if the code has expired
        if (Date.now() > storedData.expiresAt) {
            emailChangeVerificationCodes.delete(email); // Remove expired code
            return res.status(400).json({ error: "Overovací kód expiroval. Skúste to znovu." });
        }

        // Check if the entered code matches the stored one
        if (storedData.verificationCode !== verificationCode) {
            return res.status(400).json({ error: "Nesprávny overovací kód." });
        }

        // If the code is valid, delete it from memory and allow password reset
        emailChangeVerificationCodes.delete(email);
        return res.json({ message: "Overovací kód je správny. Môžete obnoviť heslo." });

    } catch (err) {
        console.error("Chyba pri overovaní kódu:", err);
        return res.status(500).json({ error: "Interná chyba servera." });
    }
});


// Reset Password Endpoint
router.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const passwordError = isStrongPassword(newPassword);

        if (!passwordError.strong) {
            return res.status(400).json({ error: passwordError.error });
        }

        // Find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Používateľ s týmto emailom neexistuje." });
        }

        // Update the user's password in the database
        user.password = newPassword;
        await user.save();

        return res.json({ message: "Heslo bolo úspešne zmenené." });

    } catch (err) {
        console.error("Chyba pri zmene hesla:", err);
        return res.status(500).json({ error: "Interná chyba servera." });
    }
});

export default router;
