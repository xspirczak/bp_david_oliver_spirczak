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




app.post('/api/keys', async (req, res) => {
  try {
    const { key } =  req.body;

    console.log(req.body);

    // Check if 'key' exists and is an array
    if (!key || !Array.isArray(key)) {
      console.log('Invalid data format:', key); // Log invalid format
      return res.status(400).json({ error: 'Invalid key format. Expecting an array of strings.' });
    }

    // Save the key to the database
    const newKey = new Key({ key });

    const savedKey = await newKey.save(); // Await saving the document
    console.log('New key saved to MongoDB:', savedKey); // Log saved document
    res.status(201).json(savedKey); // Send a response with the created document
  } catch (err) {
    console.error('Error during key creation:', err.message); // Log the error message
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});






app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Something went wrong.');
});

app.get('/api/keys', async (req, res) => {
  try {
    const keys = await Key.find();  // Fetch all documents in the 'keys' collection
    res.json(keys);  // Send the result as JSON
  } catch (err) {
    res.status(500).send('Server error');
  }
});


