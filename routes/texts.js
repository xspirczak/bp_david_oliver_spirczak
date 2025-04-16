import express from 'express';
const router = express.Router();
import Text from '../models/Text.js';
import authMiddleware from "../middleware/authMiddleware.js";
import tokenExistsMiddleware from "../middleware/tokenExistsMiddleware.js";
import mongoose from "mongoose";

// Delete document based on the id (documentID)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID textu musí byť zadané." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Neplatné ID textu." });
        }

        const deletedDoc = await Text.findByIdAndDelete(id);

        if (!deletedDoc) {
            return res.status(404).json({ message: "Dokument nenájdený." });
        }

        res.json({ message: "Dokument bol úspešne vymazaný." });
    } catch (error) {
        console.error("Chyba pri mazaní dokumentu:", error);
        res.status(500).json({ message: "Chyba servera." });
    }
});

// Update document
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, language, country, year, document } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID kľúča musí byť zadané." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Neplatné ID kľúča." });
        }

        if (!document) {
            return res.status(400).json({ message: "Dokument nesmie byť prázdny." });
        }

        const updatedDoc = await Text.findByIdAndUpdate(
            id,
            {  name: name, description: description, language: language, country: country, year: year,document: document },
        { new: true}
        );


        if (!updatedDoc) {
            return res.status(404).json({ message: "Dokument nenájdený." });
        }

        res.json({ message: "Dokument bol úspešne zmenený." });
    } catch (error) {
        console.error("Chyba pri upravovaní dokumentu:", error);
        res.status(500).json({ message: "Chyba servera." });
    }
});

router.post('/', tokenExistsMiddleware, async (req, res) => {
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
        //console.log('New document saved to MongoDB:', savedDocument); // Log saved document
        res.status(201).json(savedDocument); // Send a response with the created document
    } catch (err) {
        console.error('Error during document creation:', err.message); // Log the error message
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

router.get('/', tokenExistsMiddleware, async (req, res) => {
    try {
        const documents = await Text.find();
        const userId = req.user ? req.user.id : null;

        res.json({userId, documents});
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default router;
