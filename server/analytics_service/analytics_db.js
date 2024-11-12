import DBConnection from '../db_connection.js';

class AnalyticsService {
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
     * Retrieves ingredient usage data within a specific timeframe
     * @param {Date} startDate - Start date for the timeframe
     * @param {Date} endDate - End date for the timeframe
     * @param {string} ingredientName - Name of the ingredient
     * @returns {Promise<Array>} - Array of usage data for each day in the timeframe
     */
    async getIngredientInTimeframe(startDate, endDate, ingredientId) {
        const query = `
            SELECT ingredient_id, date, usage 
            FROM ingredientusage 
            WHERE ingredient_id = $1 
            AND date BETWEEN $2 AND $3 
            ORDER BY date;
        `;
        
        const usageData = [];
        const client = await this.pool.connect();

        try {
            const result = await client.query(query, [ingredientId, startDate, endDate]);

            usageData.push(
                ...result.rows.map(row => ({
                    date: row.date,
                    amount: parseInt(row.usage)
                }))
            );
        } catch (error) {
            console.error('Error retrieving ingredient usage data:', error);
        } finally {
            client.release();
        }

        return usageData;
    }
}

export default AnalyticsService;