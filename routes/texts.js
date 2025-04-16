import express from 'express';
const router = express.Router();
import Text from '../models/Text.js';
import authMiddleware from "../middleware/authMiddleware.js";

// Delete document based on the id (documentID)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
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

export default router;
