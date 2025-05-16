import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Prístup zamietnutý. Token nebol poskytnutý.' });
    //console.log("TOKEN", token)
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        console.log(decoded)
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Nesprávny alebo neplatný token.' });
    }
};

export default authMiddleware;
