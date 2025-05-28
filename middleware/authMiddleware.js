import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Overí platnosť JWT token a vráti objekt prihláseného používateľa ( email, meno, rola ...)
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Prístup zamietnutý. Token nebol poskytnutý.' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Nesprávny alebo neplatný token.' });
    }
};

export default authMiddleware;
