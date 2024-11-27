import express from 'express';
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

const router = express.Router();

const translate = new Translate({
    key: process.env.TRANSLATE_API_KEY,
});

router.post("/translate", async (req, res) => {
    const { texts, target } = req.body;

    if (!texts || !target) {
        return res.status(400).json({ error: "Missing required fields: texts or target" });
    }

    try {
        const promises = texts.map(async ({ index, text }) => {
            const [translation] = await translate.translate(text, target);
            return { index, translation };
        });

        const translationsArray = await Promise.all(promises);

        // Convert array to key-value map
        const translations = translationsArray.reduce((acc, { index, translation }) => {
            acc[index] = translation;
            return acc;
        }, {});

        res.json({ translations });
    } catch (error) {
        console.error("Error translating text:", error);
        res.status(500).json({ error: "Translation failed" });
    }
});


export default router;
