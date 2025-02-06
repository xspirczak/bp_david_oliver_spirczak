import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Key from './models/Keys.js';
import Document from './models/Documents.js';

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

//keys

app.post('/api/keys', async (req, res) => {
  try {
    const { key, name, description, country, year } =  req.body;

    console.log("SERVER: ", key, name, description, country, year);

    // Check if 'key' exists and is an array

    console.log(key)
    if (!key) {
      console.log('Invalid data format:', key); // Log invalid format
      return res.status(400).json({ error: 'Invalid key format. Expecting an array of strings.' });
    }

    // Save the key to the database
    const newKey = new Key({ key, name, description, country, year  });

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

// documents

app.post('/api/documents', async (req, res) => {
  try {
    
    const { document, name, description, language, country, year } = req.body;

    // Check if 'key' exists and is an array
    if (!document  || typeof document != 'string') {
      console.log('Invalid data format:', document ); // Log invalid format
      return res.status(400).json({ error: 'Invalid key format. Expecting an array of strings.' });
    }

    // Save the key to the database
    const newDocument = new Document({ document, name, description, language, country, year });

    const savedDocument = await newDocument.save(); // Await saving the document
    console.log('New document saved to MongoDB:', savedDocument); // Log saved document
    res.status(201).json(savedDocument); // Send a response with the created document
  } catch (err) {
    console.error('Error during document creation:', err.message); // Log the error message
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});


app.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents); 
  } catch (err) {
    res.status(500).send('Server error');
  }
});



