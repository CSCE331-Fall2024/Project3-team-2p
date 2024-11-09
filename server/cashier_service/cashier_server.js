import express from 'express';
import CashierService from './cashier_db.js';

const router = express.Router();
const cashier_service = new CashierService();

/**
 * @param {number} order_type - Type of the order (0, 1, or 2)
 * @param {string[]} entrees - Array of entree items (e.g., ['Broccoli Beef', 'Honey Walnut Shrimp', Mushroom Chicken])
 * @param {string[]} sides - Array of side items (eg., ['Chow Mein'])
 * @param {number} server - id of the cashier at checkout
 */
router.post('/place-order', async (req, res) => {
    const { order_type, entrees, sides, server } = req.body;

    if (![0, 1, 2].includes(order_type)) {
        return res.status(400).json({ error: 'Invalid order type. Must be 0, 1, or 2.' });
    }
    if (!Array.isArray(entrees) || entrees.length === 0) {
        return res.status(400).json({ error: 'Entrees must be a non-empty array.' });
    }
    if (!Array.isArray(sides) || sides.length === 0) {
        return res.status(400).json({ error: 'Sides must be a non-empty array.' });
    }
    if (!Number.isInteger(server)) {
        return res.status(400).json({ error: 'Server must be an integer.' });
    }

    try {
        await cashier_service.placeOrder(order_type, entrees, sides, server);
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

router.get('/entrees', async (req, res) => {
    try {
        const entrees = await cashier_service.getEntrees();
        res.json(entrees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch entrees' });
    }
});

router.get('/sides', async (req, res) => {
    try {
        const sides = await cashier_service.getSides();
        res.json(sides);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sides' });
    }
});

export default router;
