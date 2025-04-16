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

// Initialize apps
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/keys')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Create a simple route
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








