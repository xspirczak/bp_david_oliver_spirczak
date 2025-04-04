import express from 'express';
const router = express.Router();
import Key from '../models/Keys.js';
import authMiddleware from "../middleware/authMiddleware.js";

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

export default router;
