import express from 'express';
import CustomerService from './customer_db.js'

const router = express.Router();
const customer_service = new CustomerService();

/**
 * @param {number} order_type - Type of the order (0, 1, or 2)
 * @param {string[]} entrees - Array of entree items (e.g., ['Broccoli Beef', 'Honey Walnut Shrimp', Mushroom Chicken])
 * @param {string[]} sides - Array of side items (eg., ['Chow Mein'])
 */
router.post('/place-order', async (req, res) => {
    const { order_type, entrees, sides } = req.body;

    if (![0, 1, 2].includes(order_type)) {
        return res.status(400).json({ error: 'Invalid order type. Must be 0, 1, or 2.' });
    }
    if (!Array.isArray(entrees) || entrees.length === 0) {
        return res.status(400).json({ error: 'Entrees must be a non-empty array.' });
    }
    if (!Array.isArray(sides) || sides.length === 0) {
        return res.status(400).json({ error: 'Sides must be a non-empty array.' });
    }

    try {
        await customer_service.placeOrder(order_type, entrees, sides);
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

router.get('/entrees', async (req, res) => {
    try {
        const entrees = await customer_service.getEntrees();
        res.json(entrees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch entrees' });
    }
});

router.get('/sides', async (req, res) => {
    try {
        const sides = await customer_service.getSides();
        res.json(sides);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sides' });
    }
});

export default router;
