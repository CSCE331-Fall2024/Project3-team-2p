import express from 'express';
import SuggestionsService from './suggestions_db.js';

const router = express.Router();
const suggestions_service = new SuggestionsService();

/**
 * Will always output most popular bowl, plate, and bigger plate. Each order will only contain 1 side
 * entrees[0][0] corresponds to sides[0][0] and so on.
 * EXAMPLE OUTPUT:
 * {
  "entrees": [
    [
      {
        "name": "Honey Sesame Chicken",
        "order_count": "1939"
      }
    ],
    [
      {
        "name": "Beijing Beef",
        "order_count": "3790"
      },
      {
        "name": "Black Pepper Chicken",
        "order_count": "3736"
      }
    ],
    [
      {
        "name": "Sweet Fire Chicken Breast",
        "order_count": "5655"
      },
      {
        "name": "Broccoli Beef",
        "order_count": "5654"
      },
      {
        "name": "Black Pepper Sirloin Steak",
        "order_count": "5653"
      }
    ]
  ],
  "sides": [
    [
      {
        "name": "Chow Mein",
        "order_count": "5656"
      }
    ],
    [
      {
        "name": "Chow Mein",
        "order_count": "5618"
      }
    ],
    [
      {
        "name": "White Rice",
        "order_count": "5660"
      }
    ]
  ]
}
 */
router.get('/popular', async (req, res) => {
    try {
        const { entrees, sides } = await suggestions_service.getMostPopularOrders();
        res.json({
            entrees,
            sides
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch most popular orders' });
    }
});

export default router;