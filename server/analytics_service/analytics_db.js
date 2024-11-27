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
     * @param {string} ingredientId - ID of the ingredient
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

    /**
     * Generates X Report for a given day
     * @param {Date} day - The date for which the report is generated
     * @returns {Promise<Array>} - Array of objects containing hourly sales data
     */
    async getXReport(day) {
        const query = `
            SELECT 
                DATE_TRUNC('hour', o.timestamp) AS hour, 
                COUNT(o.id) AS sales_count, 
                SUM(o.price) AS total_revenue 
            FROM orders o 
            WHERE DATE(o.timestamp) = $1 
            GROUP BY DATE_TRUNC('hour', o.timestamp) 
            ORDER BY hour;
        `;

        const reportData = [];
        const client = await this.pool.connect();

        try {
            const result = await client.query(query, [day.date]);

            result.rows.forEach(row => {
                reportData.push({
                    hour: row.hour,
                    sales_count: parseInt(row.sales_count, 10),
                    total_revenue: Math.round(parseFloat(row.total_revenue) * 100) / 100
                });
            });
        } catch (error) {
            console.error('Error generating X Report:', error);
        } finally {
            client.release();
        }

        return reportData;
    }
}

export default AnalyticsService;