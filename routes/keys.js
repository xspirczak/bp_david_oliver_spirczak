import express from 'express';
const router = express.Router();
import Key from '../models/Keys.js';
import authMiddleware from "../middleware/authMiddleware.js";
import tokenExistsMiddleware from "../middleware/tokenExistsMiddleware.js";
import mongoose from "mongoose";
import {checkForDuplicates} from "../src/utils/functions.js";
import Text from "../models/Text.js";

// Delete key based on the id (keyID)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!id) {
            return res.status(400).json({ message: "ID kľúča musí byť zadané." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Neplatné ID kľúča." });
        }

        const keyToBeDeleted = await Key.findById(id);


        if (keyToBeDeleted) {
            if (!keyToBeDeleted.uploadedBy || keyToBeDeleted.uploadedBy.toString() !== user.id) {
                return res.status(401).json({message: "Nemáte opravnenie vymazať tento kľúč."});
            }
        } else {
            return res.status(404).json({ message: "Kľúč nebol nájdený." });
        }

        await Key.findByIdAndDelete(id);



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

        if (!id) {
            return res.status(400).json({ message: "ID kľúča musí byť zadané." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Neplatné ID kľúča." });
        }

        const foundKey = await Key.findById(id);

        //console.log(foundKey);
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

        if (!id) {
            return res.status(400).json({ message: "ID kľúča musí byť zadané." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Neplatné ID kľúča." });
        }

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

        if (!key) {
            return res.status(400).json({ error: 'Kľúč nesmie byť prázdny.' });
        }

        if (checkForDuplicates(key)) {
            return res.status(400).json({ error: 'Kľúč nesmie obsahovať duplicitné kódy.' });
        }

        const uploadedBy = req.user ? req.user.id : null;

        // Save the key to the database
        const newKey = new Key({ key, name, description, country, year, uploadedBy });

        const savedKey = await newKey.save(); // Await saving the document
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


router.post('/insertMany', async (req, res) => {
    try {
        let key = '{"a":[604,522,799,126,503],"b":[860,437,201,602,970],"c":[365],"d":[813,824],"e":[300,393],"f":[33,708],"g":[447,929,651,956],"h":[908],"i":[459,812,728,233],"j":[690,692,500,167],"k":[958,554,680],"l":[438,340,111,919],"m":[253],"n":[546,596],"o":[521,525,861,114,756],"p":[565,292],"q":[922,482,649,907,942],"r":[748,561,72],"s":[54],"t":[75],"u":[261,32],"v":[470,180,149,83,766],"w":[341,686],"x":[662,571,734,257,841],"y":[774,489,51,478],"z":[502,583,584],"un mandat":[71,74,640,36,902],"habiller":[1,628,737,317],"sécuritaire":[358,274,394,496],"un million":[585,865,638,765,221],"formidable":[772,627,62,103],"une alternative":[569,911,783,336],"effacer":[457,50],"un désir":[81],"une queue":[163],"laver":[290,518],"une loi":[430,738],"protéger":[387],"une plante":[468,276,644],"maintenir":[961,609,304,784],"déterminant":[131,751,18],"une audience":[397,576,816,696],"constamment":[872],"une chose":[746,916],"convertir":[887,533,421],"croyant":[826,246,543,380,383],"interrompre":[807,504],"frapper":[403,28,994,362,480]}'
        key = JSON.parse(key)
        const n = 500
        for (let i = 0; i < n; i++) {
            const newDocument = new Key({ key: key});
            await newDocument.save(); // Await saving the document
        }
        res.status(201).json("Saved {n} keys"); // Send a response with the created document

    } catch (err) {
        res.status(500).send('Server error: ' + err.message);
    }
})



export default router;
