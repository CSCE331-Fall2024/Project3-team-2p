import DBConnection from '../db_connection.js';

class CustomerService {
    constructor() {
        const db = new DBConnection();
        this.pool = db.pool;
    }

    /**
     * Writes order to database and updates ingredients and associated join tables
     * @param {number} order_type - 0 if bowl, 1 if plate, 2 if bigger plate
     * @param {Array} entrees - All entrees that make up this order, do not include sides here
     * @param {Array} sides - All sides that make up this order, do not include entrees here
     * @param {number} server - Put 1 for customers, else put the id of the cashier 
     */
    async placeOrder(order_type, entrees, sides, server=1) {
        const query = `
            INSERT INTO orders (id, server, price, type, timestamp)
            VALUES ($1, $2, $3, $4, $5);
        `;
        const id = await this.getMaxId("orders") + 1;
        let price = 0;
        
        switch (order_type) {
            case 0:
                price += 8.99;
                break;
            case 1:
                price += 9.99;
                break;
            case 2:
                price += 11.99;
        }
        price += await this.#getExtraPrice(entrees, sides);
        const timestamp = new Date();

        try {
            await this.pool.query(query, [id, server, price, order_type, timestamp]);
        }
        catch (error) {
            console.error("error placing order", error);
        }
        const menu_items_keys = await this.#updateMenuItemsOrdersTable(entrees, sides, id);
        await this.#updateIngredientsTable(menu_items_keys);
        await this.#updateIngredientUsageTable(menu_items_keys, timestamp);
        console.log("order placed successfully");
    }

    /**
     * 
     * @returns Array of dictonaries of entrees, the keys are id, name, price, entree
     */
    async getEntrees() {
        const query = `
            SELECT *
            FROM menuitems
            WHERE entree = 1;
        `
        try {
            const {rows: entrees} = await this.pool.query(query);
            return entrees;
        }
        catch (error) {
            console.error("error getting entrees", error);
        }   
    }

    /**
     * 
     * @returns Array of dictionaries of sides, the keys are id, name, price, entree
     */
    async getSides() {
        const query = `
            SELECT *
            FROM menuitems
            WHERE entree = 0;
        `
        try {
            const {rows: sides} = await this.pool.query(query);
            return sides;
        }
        catch (error) {
            console.error("error getting sides", error);
        }  
    }

    /**
     * Gets maximum id from specified table
     * @param {string} table_name - name of table in db
     * @returns max id as an integer
     */
    async getMaxId(table_name) {
        const query = `SELECT MAX(id) FROM ${table_name};`;
        let max_id = -1;
        try {
            const {rows} = await this.pool.query(query);
            max_id = rows[0].max;
        }
        catch (error) {
            console.error(error);
        }
        return max_id;  
    }

    /**
     * Closes database connection
     * @returns 
     */
    close() {
        return this.pool.end();
    }


    /**
     * There is a table called ingredientusage which is used for analytics
     * This function is used to update that table
     * @param {Array<Number>} menu_items_keys - the keys of the menu items
     * @param {Date} order_date - the date of the order used to find the right bucket
     */
    async #updateIngredientUsageTable(menu_items_keys, order_date) {
        try {
            const ingredientUsageQuery = `
                SELECT i.id AS ingredient_id, SUM(im.quantity) AS total_usage
                FROM IngredientsMenuItems im
                JOIN Ingredients i ON i.id = im.IngredientKey
                WHERE im.MenuItemKey = ANY($1::int[])
                GROUP BY i.id;
            `;
    
            const ingredientUsages = await this.pool.query(ingredientUsageQuery, [menu_items_keys]);
    
            for (const usage of ingredientUsages.rows) {
                const { ingredient_id, total_usage } = usage;
    
                const updateQuery = `
                    INSERT INTO ingredientusage (ingredient_id, date, usage)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (ingredient_id, date)
                    DO UPDATE SET usage = ingredientusage.usage + EXCLUDED.usage;
                `;
    
                await this.pool.query(updateQuery, [ingredient_id, order_date, total_usage]);
            }
        } catch (error) {
            console.error('Error updating ingredient usage data:', error);
        }
    }

    async #updateIngredientsTable(menu_items_keys) {
        const placeholders = menu_items_keys.map((_, i) => `$${i + 1}`).join(", ");
        const select_join_query = `
            SELECT i.id AS ingredient_id, i.stock, im.quantity 
            FROM ingredients i
            JOIN ingredientsmenuitems im ON i.id = im.ingredientkey
            WHERE im.menuitemkey IN (${placeholders});
        `;

        try {
            const {rows} = await this.pool.query(select_join_query, menu_items_keys);

            // Get new stock values and create the batch update query
            const update_query = `
                UPDATE ingredients
                SET stock = CASE 
                    ${rows.map((row, i) => `WHEN id = $${i * 2 + 1} THEN $${i * 2 + 2}`).join(" ")}
                    ELSE stock 
                END
                WHERE id IN (${rows.map((_, i) => `$${i * 2 + 1}`).join(", ")});
            `;

            const params = rows.flatMap(row => [row.ingredient_id, row.stock - row.quantity]);
            await this.pool.query(update_query, params); 
            console.log("join table updated successfully");
        } catch (error) {
            console.error("Error updating ingredient stocks:", error);
        }
    }

    async #updateMenuItemsOrdersTable(entrees, sides, order_id) {
        const items = [...entrees, ...sides];
        const select_query = `SELECT id FROM menuitems WHERE name = ANY($1)`;

        try { 
            let id = await this.getMaxId('menuitemsorders');
            const {rows} = await this.pool.query(select_query, [items]);

            const insert_query = `
                INSERT INTO menuitemsorders (id, menuitemkey, orderkey) 
                VALUES ${rows.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(", ")};
            `;

            const params = rows.flatMap(row => {
                id += 1;
                return [id, row.id, order_id];
            });
            
            await this.pool.query(insert_query, params);
            console.log("menuitemsorders table updated successfully");
            return rows.map(row => row.id);
        }
        catch (error) {
            console.error("error updating menuitemsorders table", error);
        }
    }

    async #getExtraPrice(entrees, sides) {
        const query = `SELECT price FROM menuitems WHERE name = ANY($1)`;
        let price = 0;
        try {
            const items = [...entrees, ...sides];
            const {rows} = await this.pool.query(query, [items]);
            for (const row of rows) {
                price += row.price;
            }
        }
        catch (error) {
            console.error(error);
        }
        return price;
    }

}

export default CustomerService;
