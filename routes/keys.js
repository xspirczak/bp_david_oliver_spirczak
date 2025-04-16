import express from 'express';
const router = express.Router();
import Key from '../models/Keys.js';
import authMiddleware from "../middleware/authMiddleware.js";
import tokenExistsMiddleware from "../middleware/tokenExistsMiddleware.js";

// Delete key based on the id (keyID)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedKey = await Key.findByIdAndDelete(id);

        if (!deletedKey) {
            return res.status(404).json({ message: "Kľúč nebol nájdený." });
        }

        res.json({ message: "Klúč bol úspešne vymazaný." });
    } catch (error) {
        console.error("Chyba pri mazaní kľúča:", error);
        res.status(500).json({ message: "Chyba servera." });
    }
});

// Get key based on id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const foundKey = await Key.findById(id);

        console.log(foundKey);
        if (!foundKey) {
            return res.status(404).json({ message: "Kľúč nebol nájdený." });
        }

        res.json({ key: foundKey });
    } catch (error) {
        console.error("Chyba pri získavaní kľúča:", error);
        res.status(500).json({ message: "Chyba servera." });
    }
});

// Update key
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, language, country, year, key } = req.body;

        if (!key) {
            return res.status(400).json({ message: "Kľúč nesmie byť prázdny." });
        }


        if (!JSON.parse(key)) {
            return res.status(400).json({ message: "Kľúč musí byť vo formáte JSON." });
        }
        const parsed = JSON.parse(key);


        const codes = new Set();
        let cnt = 0;

        Object.values(parsed).forEach((val) => {
            val.forEach((item) => {
                codes.add(item);
                cnt++;
            })
        })

        if (codes.size !== cnt) {
            return res.status(400).json({ message: "Kľúč sa nesmie vyskytovať viackrát." });
        }
        const updatedKey = await Key.findByIdAndUpdate(
            id,
            {  name: name, description: description, language: language, country: country, year: year,key: parsed },
            { new: true}
        );


        if (!updatedKey) {
            return res.status(404).json({ message: "Kľúč nebol nájdený." });
        }

        res.json({ message: "Kľúč bol úspešne zmenený.", key:updatedKey });
    } catch (error) {
        console.error("Chyba pri upravovaní kľúča:", error);
        res.status(500).json({ message: "Chyba servera." });
    }
});

router.post('/', tokenExistsMiddleware,async (req, res) => {
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

router.get('/', async (req, res) => {
    try {
        const keys = await Key.find();  // Fetch all documents in the 'keys' collection
        //const userId = req.user.id;

        res.json(keys);  // Send the result as JSON
        //console.log("KEYS", keys)
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default router;
