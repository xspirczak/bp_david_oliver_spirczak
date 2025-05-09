import express from 'express';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import authMiddleware from "../middleware/authMiddleware.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {isStrongPassword} from "../src/utils/functions.js";
import resetPasswordMiddleware from "../middleware/resetPasswordMiddleware.js";
const router = express.Router();
dotenv.config();

// Temporary storage for email verification codes
const verificationCodes = new Map();

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
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

        if (!(firstName && lastName && role)) {
            return res.status(400).json({ error: "Zadajte všetky povinné polia" });
        }

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

        // Store the verification code temporarily
        verificationCodes.set(email, verificationCode);
        //console.log("Email user:", process.env.EMAIL_USER, email);

        // Send verification email
        const mailOptions = {
            from: 'oliverspirczak@gmail.com',
            to: email,
            subject: "CipherMatcher - Verifikácia emailu",
            text: `Dobrý deň,

ďakujeme za registráciu v našej aplikácii.

Váš verifikačný kód je: ${verificationCode}

Zadajte ho do aplikácie pre dokončenie registrácie.

S pozdravom,  
CipherMatcher`
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

// Temporary storage for email change verification codes
const emailChangeVerificationCodes = new Map();

//Request Email Change
router.post("/request-email-change", authMiddleware, async (req, res) => {
    try {
        const { newEmail } = req.body;
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: "Chýba ID používateľa." });
        }

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
            subject: "CipherMatcher - Zmena emailovej adresy",
            text: `Dobrý deň,

požiadali ste o zmenu vašej e-mailovej adresy v našej aplikácii. 
Na overenie tejto zmeny prosím zadajte nasledujúci overovací kód:

Overovací kód: ${verificationCode}

Ak ste o túto zmenu nežiadali, ignorujte túto správu.

S pozdravom,  
CipherMatcher`
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

        if (!userId) {
            return res.status(400).json({ message: "Chýba ID používateľa." });
        }
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
            token: newAccessToken,
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

        if(!email) {
            return res.status(400).json({ error: "Email je povinný." });
        }
        // Check if the email is used
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ error: "Používateľ s týmto emailom neexistuje." });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store the code in memory (or database) with an expiration time
        emailChangeVerificationCodes.set(email, {
            verificationCode,
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 m
        });

        // Send email with verification code
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "CipherMatcher - Obnovenie hesla",
            text: `Dobrý deň,

požiadali ste o obnovenie hesla v našej aplikácii. 
Na overenie tejto zmeny prosím zadajte nasledujúci overovací kód:

Overovací kód: ${verificationCode}

Ak ste o túto zmenu nežiadali, ignorujte túto správu.

S pozdravom,  
CipherMatcher`

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
        const newResetToken = jwt.sign(
            { email: email,verificationCode: verificationCode },
            process.env.JWT_SECRET,
            { expiresIn: "5m" }
        );


        emailChangeVerificationCodes.delete(email);

        return res.json({ message: "Overovací kód je správny. Môžete obnoviť heslo.", token:newResetToken});

    } catch (err) {
        console.error("Chyba pri overovaní kódu:", err);
        return res.status(500).json({ error: "Interná chyba servera." });
    }
});


// Reset Password Endpoint
router.post("/reset-password", resetPasswordMiddleware, async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Zadajte email." });
        }

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
