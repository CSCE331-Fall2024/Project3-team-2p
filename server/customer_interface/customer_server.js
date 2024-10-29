import express from 'express';
import CustomerService from './customer_db.js'

const router = express.Router();
const customer_service = new CustomerService();

router.post('/place-order', async (req, res) => {
    const { order_type, entrees, sides } = req.body;

    if (!order_type || !Array.isArray(entrees) || !Array.isArray(sides)) {
        return res.status(400).json({ error: 'Invalid request body' });
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