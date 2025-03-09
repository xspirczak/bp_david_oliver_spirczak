import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'random';

const tokenExistsMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        req.user = null; // Ak nie je token, používateľ je neprihlásený
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id }; // Pridáme ID používateľa do req.user
        next();
    } catch (error) {
        req.user = null; // Neplatný token = neprihlásený používateľ
        next();
    }
};

export default tokenExistsMiddleware;