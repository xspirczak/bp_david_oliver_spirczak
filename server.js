import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authMiddleware from './middleware/authMiddleware.js';
import authRoutes from './routes/auth.js';
import textRoutes from './routes/texts.js';
import keyRoutes from './routes/keys.js';
import mappingRoutes from './routes/mapping.js';
import userRoutes from './routes/user.js';
import tutorialRoutes from './routes/tutorial.js';

const allowedOrigins = [
  "https://bp-david-oliver-spirczak.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174"
];

// Inicializácia aplikácie
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


// Pripojenie na MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected", process.env.MONGODB_URI))
  .catch(err => console.log(err));

// Iniacializácia portu
const PORT = process.env.PORT;

// Testovanie
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Jednoducha route na otestovanie API pripojenia
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Something went wrong.');
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello, ${req.user.email}! You accessed a protected route.` });
});

app.use('/api/auth', authRoutes);
app.use("/api/texts", textRoutes);
app.use("/api/keys", keyRoutes);
app.use("/api/mapping", mappingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tutorial", tutorialRoutes);


export default app;





