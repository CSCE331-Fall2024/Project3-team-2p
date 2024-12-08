import DBConnection from '../db_connection.js';

class InventoryService {
    constructor() {
        const db = new DBConnection();
        this.pool = db.pool;
    }

    /**
     * Closes database connection
     * @returns 
     */
    close() {
        return this.pool.end();
    }

    /**
     * Retrieves the maximum ID in a table to prevent ID duplication
     * @param {string} tableName - Name of the table
     * @returns {number} - The maximum ID in the specified table
     */
    async getMaxID(tableName) {
        const query = `SELECT MAX(id) as maxId FROM ${tableName};`;
        try {
            const { rows } = await this.pool.query(query);
            return rows[0].maxid || 0;
        } catch (error) {
            console.error(`Error retrieving max ID for table ${tableName}:`, error);
            throw error;
        }
    }

    /**
     * Fetches all ingredients
     * @returns Array of ingredients with keys: id, name, stock, threshold, price, unit
     */
    async getAllIngredients() {
        const query = `
            SELECT id, name, stock, threshold, price, unit
            FROM ingredients
            ORDER BY id ASC;
        `;
        try {
            const { rows: ingredients } = await this.pool.query(query);
            return ingredients;
        } catch (error) {
            console.error("Error fetching ingredients:", error);
            throw error;
        }
    }

    /**
     * Fetches all menu items
     * @returns Array of menu items with keys: id, name, price
     */
    async getAllMenuItems() {
        const query = `
            SELECT 
                mi.id AS menuItemId,
                mi.name AS menuItemName,
                mi.price AS menuItemPrice,
                mi.entree AS menuItemEntree,
                i.id AS ingredientId,
                i.name AS ingredientName,
                COALESCE(im.quantity, 0) AS ingredientQuantity,
                i.unit AS ingredientUnit
            FROM menuitems mi
            LEFT JOIN ingredientsmenuitems im ON mi.id = im.menuitemkey
            LEFT JOIN ingredients i ON im.ingredientkey = i.id
            ORDER BY mi.id, i.id;
        `;
        
        try {
            const { rows } = await this.pool.query(query);

            const menuItems = rows.reduce((acc, row) => {
                let menuItem = acc.find(item => item.id === row.menuitemid);
                if (!menuItem) {
                    menuItem = {
                        id: row.menuitemid,
                        name: row.menuitemname,
                        entree: row.menuitementree,
                        price: row.menuitemprice,
                        ingredients: []
                    };
                    acc.push(menuItem);
                }

                if (row.ingredientid) {
                    menuItem.ingredients.push({
                        id: row.ingredientid,
                        name: row.ingredientname,
                        quantity: row.ingredientquantity,
                        unit: row.ingredientunit
                    });
                }

                return acc;
            }, []);

            return { menuItems };
        } catch (error) {
            console.error("Error fetching menu items with ingredients:", error);
            throw error;
        }
    }

    /**
     * Fetches all employees
     * @returns Array of employees with keys: id, username, pin, manager
     */
    async getAllEmployees() {
        const query = `
            SELECT id, username, pin, manager
            FROM employees
            ORDER BY id ASC;
        `;
        try {
            const { rows: employees } = await this.pool.query(query);
            return employees;
        } catch (error) {
            console.error("Error fetching employees:", error);
            throw error;
        }
    }

    /**
     * Sends updated menu items to the database
     * @param {Array} menuItems - Array of menu item objects
     * @param {Object} ingredientsMenuItems - Object with menu item IDs as keys and ingredient IDs array as values
     */
    async updateMenuItems(menuItems) {
        console.log("Sending menu to backend...");
        
        console.log(menuItems);

        try {
            const ingredientsMenuItems = {};
            for (const item of menuItems) {
                ingredientsMenuItems[item.id] = item.ingredients
                    .filter(ingredient => ingredient.quantity > 0)
                    .map(ingredient => ({
                        ingredientId: ingredient.id,
                        quantity: ingredient.quantity
                    }));
            }
    
            await this.#updateMenuItems(menuItems);
            await this.#updateIngredientsMenuItems(ingredientsMenuItems);
    
            console.log("Menu items sent to backend successfully.");
        } catch (error) {
            console.error("Error sending menu to backend:", error);
        }
    }

    /**
     * Updates the employees table with new or edited employees
     * @param {Array} employees - Array of employee objects
     */
    async updateEmployees(employees) {
        console.log("Sending employees to backend...");

        try {
            await this.#updateEmployeeRecords(employees);
            console.log("Employees sent to backend successfully.");
        } catch (error) {
            console.error("Error sending employees to backend:", error);
        }
    }

    /**
     * Updates the ingredients table with new or edited ingredients
     * @param {Array} ingredients - Array of ingredient objects
     */
    async updateIngredients(ingredients) {
        console.log("Sending ingredients to backend...");

        try {
            await this.#updateIngredientRecords(ingredients);
            console.log("Ingredients sent to backend successfully.");
        } catch (error) {
            console.error("Error sending ingredients to backend:", error);
        }
    }

    /**
     * Updates the menu items table with new or edited items
     * @param {Array} menuItems - Array of menu item objects
     */
    async #updateMenuItems(menuItems) {
        const query = `
            INSERT INTO menuitems (id, name, price, entree)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id)
            DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, entree = EXCLUDED.entree;
        `;

        try {
            for (const item of menuItems) {
                await this.pool.query(query, [
                    item.id,
                    item.name,
                    item.price,
                    item.entree
                ]);
            }
        } catch (error) {
            console.error("Error updating menu items:", error);
            throw error;
        }
    }

    /**
     * Updates the ingredients menu items table with new associations
     * @param {Object} ingredientsMenuItems - Object with menu item IDs as keys and an array of ingredient objects as values
     */
    async #updateIngredientsMenuItems(ingredientsMenuItems) {
        const deleteQuery = `
            DELETE FROM ingredientsmenuitems WHERE menuitemkey = $1;
        `;
        const insertQuery = `
            INSERT INTO ingredientsmenuitems (id, ingredientkey, menuitemkey, quantity)
            VALUES ($1, $2, $3, $4);
        `;

        try {
            let id = await this.getMaxID("ingredientsmenuitems") + 1;

            for (const [menuItemId, ingredients] of Object.entries(ingredientsMenuItems)) {
                await this.pool.query(deleteQuery, [menuItemId]);

                for (const ingredient of ingredients) {
                    const { ingredientId, quantity } = ingredient;
                    await this.pool.query(insertQuery, [id, ingredientId, parseInt(menuItemId), quantity]);
                    id += 1;
                }
            }
        } catch (error) {
            console.error("Error updating ingredients menu items:", error);
            throw error;
        }
    }

    /**
     * Updates the employees table with new or edited employee records
     * @param {Array} employees - Array of employee objects
     */
    async #updateEmployeeRecords(employees) {
        const query = `
            INSERT INTO employees (id, username, pin, manager)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id)
            DO UPDATE SET username = EXCLUDED.username, pin = EXCLUDED.pin, manager = EXCLUDED.manager;
        `;

        try {
            for (const employee of employees) {
                await this.pool.query(query, [
                    employee.id,
                    employee.username,
                    employee.pin,
                    employee.manager
                ]);
            }
        } catch (error) {
            console.error("Error updating employee records:", error);
            throw error;
        }
    }

    /**
     * Updates the ingredients table with new or edited ingredient records
     * @param {Array} ingredients - Array of ingredient objects
     */
    async #updateIngredientRecords(ingredients) {
        const query = `
            INSERT INTO ingredients (id, name, stock, threshold, price, unit)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id)
            DO UPDATE SET 
                name = EXCLUDED.name,
                stock = EXCLUDED.stock,
                threshold = EXCLUDED.threshold,
                price = EXCLUDED.price,
                unit = EXCLUDED.unit;
        `;

        try {
            for (const ingredient of ingredients) {
                await this.pool.query(query, [
                    ingredient.id,
                    ingredient.name,
                    ingredient.stock,
                    ingredient.threshold,
                    ingredient.price,
                    ingredient.unit
                ]);
            }
        } catch (error) {
            console.error("Error updating ingredient records:", error);
            throw error;
        }
    }
}

export default InventoryService;