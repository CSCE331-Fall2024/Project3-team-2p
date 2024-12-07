import express from 'express';
import InventoryService from './inventory_db.js';

const router = express.Router();
const inventoryService = new InventoryService();

router.get('/menu-items', async (req, res) => {
    try {
        const menuItems = await inventoryService.getAllMenuItems();
        res.json(menuItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

/**
 * Expected request body:
 * {
 *   "menuItems": [
 *     { 
 *       "id": number,                
 *       "Name": string,          
 *       "Additional Cost": number,   
 *       "Entree": number             
 *     },
 *     ...
 *   ],
 *   "ingredientsMenuItems": {
 *     [menuItemId]: [ingredientId, ...]
 *   }
 * }
 */

router.post('/menu-items', async (req, res) => {
    const menuItems = req.body;

    try {
        await inventoryService.updateMenuItems(menuItems);
        res.status(201).json({ message: 'Menu items updated successfully' });
    } catch (error) {
        console.error('Error updating menu items:', error);
        res.status(500).json({ error: 'Failed to update menu items' });
    }
});

router.get('/ingredients', async (req, res) => {
    try {
        const ingredients = await inventoryService.getAllIngredients();
        res.json(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
});

/** 
 * Expected request body:
 * {
 *   "ingredients": [
 *     { 
 *       "id": number,     
 *       "name": string,     
 *       "stock": number,       
 *       "threshold": number,  
 *       "price": number,  
 *       "unit": string           
 *     },
 *     ...
 *   ]
 * }
 */

router.post('/ingredients', async (req, res) => {
    const { ingredients } = req.body;

    try {
        await inventoryService.updateIngredients(ingredients);
        res.status(201).json({ message: 'Ingredients updated successfully' });
    } catch (error) {
        console.error('Error updating ingredients:', error);
        res.status(500).json({ error: 'Failed to update ingredients' });
    }
});

router.get('/employees', async (req, res) => {
    try {
        const employees = await inventoryService.getAllEmployees();
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

/**
* Expected request body:
* {
*   "employees": [
*     { 
*       "id": number,         
*       "username": string,    
*       "pin": number,        
*       "manager": boolean       
*     },
*     ...
*   ]
* }
*/

router.post('/employees', async (req, res) => {
    const { employees } = req.body;

    try {
        await inventoryService.updateEmployees(employees);
        res.status(201).json({ message: 'Employees updated successfully' });
    } catch (error) {
        console.error('Error updating employees:', error);
        res.status(500).json({ error: 'Failed to update employees' });
    }
});

export default router;
