import express from 'express';
import AnalyticsService from './analytics_db.js';

const router = express.Router();
const analyticsService = new AnalyticsService();

router.get('/ingredient-usage', async (req, res) => {
    try {
        const { id, startDate, endDate } = req.query;

        if (!id || !startDate || !endDate) {
            return res.status(400).json({ error: 'Missing required query parameters: id, startDate, and endDate' });
        }

        const usageData = await analyticsService.getIngredientInTimeframe(startDate, endDate, id);

        res.json(usageData);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

router.get('/x-report', async (req, res) => {
    try {
        const day = req.query;

        if (!day) {
            return res.status(400).json({ error: 'Missing required query parameter: day' });
        }

        const xReport = await analyticsService.getXReport(day);

        res.json(xReport);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

export default router;
