import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'random';

// Check whether token is set and if it contains the verification code
const resetPasswordMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Neautorizovaný prístup. Chýba token." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { email: decoded.email, verificationCode: decoded.verificationCode };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Neplatný alebo expirovaný token." });
    }
};

export default resetPasswordMiddleware;