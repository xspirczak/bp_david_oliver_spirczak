import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import authMiddleware from './middleware/authMiddleware.js';
import tokenExistsMiddleware from './middleware/tokenExistsMiddleware.js';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Key from './models/Keys.js';
import Text from './models/Text.js';
import authRoutes from './routes/auth.js';
import {isStrongPassword} from './src/functions.js'
import textRoutes from './routes/texts.js';
import keyRoutes from './routes/keys.js';
import mappingRoutes from './routes/mapping.js';


// Initialize app
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/keys')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const JWT_SECRET = process.env.JWT_SECRET || 'random';
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH || 'random1';


// Create a simple route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//keys
app.post('/api/keys', tokenExistsMiddleware,async (req, res) => {
  try {
    const { key, name, description, country, year } =  req.body;

    //console.log("SERVER: ", key, name, description, country, year);

    // Check if 'key' exists and is an array

    //console.log(key)
    if (!key) {
      console.log('Invalid data format:', key); // Log invalid format
      return res.status(400).json({ error: 'Invalid key format. Expecting an array of strings.' });
    }

    const uploadedBy = req.user ? req.user.id : null;

    // Save the key to the database
    const newKey = new Key({ key, name, description, country, year, uploadedBy });

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
    //const userId = req.user.id;

    res.json(keys);  // Send the result as JSON
    //console.log("KEYS", keys)
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// documents
app.post('/api/texts', tokenExistsMiddleware, async (req, res) => {
  try {

    const { document, name, description, language, country, year } = req.body;

    // Check if 'key' exists and is an array
    if (!document  || typeof document != 'string') {
      console.log('Invalid data format:', document ); // Log invalid format
      return res.status(400).json({ error: 'Invalid key format. Expecting an array of strings.' });
    }

    const uploadedBy = req.user ? req.user.id : null;

    // Save the key to the database
    const newDocument = new Text({ document, name, description, language, country, year, uploadedBy });

    const savedDocument = await newDocument.save(); // Await saving the document
    console.log('New document saved to MongoDB:', savedDocument); // Log saved document
    res.status(201).json(savedDocument); // Send a response with the created document
  } catch (err) {
    console.error('Error during document creation:', err.message); // Log the error message
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});


app.get('/api/texts', tokenExistsMiddleware, async (req, res) => {
  try {
    const documents = await Text.find();
    const userId = req.user ? req.user.id : null;

    res.json({userId, documents});
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Login Route
app.post('/api/users', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body);
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'Email alebo heslo je nesprávne.' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Email alebo heslo je nesprávne.' });

    const userFullName = user.firstName + " " + user.lastName;
    // Generate JWT token
    const accessToken = jwt.sign({ id: user._id, email: user.email, fullName: userFullName }, JWT_SECRET, { expiresIn: '1h' });

    console.log("TOKEN: ", accessToken);

    res.json({ message: 'Prihlásenie bolo úspešné', token: accessToken, user});
  } catch (err) {
    console.log("login error: ", err);

    res.status(500).json({ error: err.message });
  }
});

// Get user
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ error: 'Používateľ sa nenašiel' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.use('/api/auth', authRoutes);
app.use("/api/texts", textRoutes);
app.use("/api/keys", keyRoutes);
app.use("/api/mapping", mappingRoutes);

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello, ${req.user.email}! You accessed a protected route.` });
});

// Update user name
app.put('/api/users/update-name', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: "First name and last name are required" });
    }

    // Find the user by ID (from middleware)
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { firstName, lastName },
        { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generovanie nového JWT tokenu s aktualizovaným menom
    const newToken = jwt.sign(
        { id: updatedUser._id, email: updatedUser.email, fullName: `${updatedUser.firstName} ${updatedUser.lastName}` },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ message: "Name updated successfully", user: updatedUser, token: newToken});
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// Update user password
app.put('/api/users/update-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    //console.log(req.body);

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Staté a nové heslá jú požadované" });
    }

    const passwordError = isStrongPassword(newPassword);

    if (!passwordError.strong) {
      return res.status(400).json({ error: passwordError.error });
    }

    // Find user in the database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Používateľ sa nenašiel." });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Staré heslo je nesprávne." });
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Heslo bolo zmenené." });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});








