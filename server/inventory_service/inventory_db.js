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
            SELECT id, name, price
            FROM menuitems
            ORDER BY id ASC;
        `;
        try {
            const { rows: menuItems } = await this.pool.query(query);
            return menuItems;
        } catch (error) {
            console.error("Error fetching menu items:", error);
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
    async updateMenuItems(menuItems, ingredientsMenuItems) {
        console.log("Sending menu to backend...");
        
        try {
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
                    item.Name,
                    item["Additional Cost"],
                    item.Entree
                ]);
            }
        } catch (error) {
            console.error("Error updating menu items:", error);
            throw error;
        }
    }

    /**
     * Updates the ingredients menu items table with new associations
     * @param {Object} ingredientsMenuItems - Object with menu item IDs as keys and ingredient IDs array as values
     */
    async #updateIngredientsMenuItems(ingredientsMenuItems) {
        const query = `
            INSERT INTO ingredientsmenuitems (id, ingredientkey, menuitemkey, quantity)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id)
            DO UPDATE SET ingredientkey = EXCLUDED.ingredientkey, menuitemkey = EXCLUDED.menuitemkey, quantity = EXCLUDED.quantity;
        `;

        try {
            let id = await this.getMaxID("ingredientsmenuitems") + 1;

            for (const [menuItemId, ingredientKeys] of Object.entries(ingredientsMenuItems)) {
                for (const ingredientId of ingredientKeys) {
                    await this.pool.query(query, [id, ingredientId, parseInt(menuItemId), 100]);
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
}

export default InventoryService;