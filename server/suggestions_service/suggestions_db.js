import DBConnection from "../db_connection.js";

class SuggestionsService {
    constructor() {
        const db = new DBConnection();
        this.pool = db.pool;
    }

    async getMostPopularOrders() {
        let entrees = [];
        let sides = [];
        try {
            for (let i=0; i<3; ++i) {
                const query = `
                    SELECT 
                        mi.name AS name,
                        COUNT(mio.menuitemkey) AS order_count
                    FROM 
                        menuitemsorders mio
                    JOIN 
                        menuitems mi ON mio.menuitemkey = mi.id
                    JOIN 
                        orders o ON mio.orderkey = o.id
                    WHERE 
                        mi.entree = $1 AND o.type = $2
                    GROUP BY 
                        mi.name
                    ORDER BY 
                        order_count DESC
                    LIMIT $3;
                `

                const res = await this.pool.query(query, [1, i, i+1]);
                entrees.push(res.rows);
                const res2 = await this.pool.query(query, [0, i, 1]);
                sides.push(res2.rows);
            }
        }
        catch (error) {
            console.error("error querying bowl data", error);
        }
        return { entrees, sides };
    }
}

// let s = new SuggestionsService();
// const { entrees, sides } = await s.getMostPopularOrders();
// console.log("Entrees:", entrees);
// console.log("Sides:", sides);

export default SuggestionsService;
