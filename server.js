import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Key from './models/Keys.js';

// Initialize app
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/keys')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Create a simple route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// POST: Add a new user
app.post('/api/keys', async (req, res) => {
  try {
    const { key, values } = req.body;
    const keys = new Key({ key, values });
    await keys.save();
    res.json(keys);
  } catch (err) {
    res.status(500).send('Server error');
  }
});


app.get('/api/keys', async (req, res) => {
    try {
      const keys = await Key.find();  // Fetch all documents in the 'keys' collection
      res.json(keys);  // Send the result as JSON
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
