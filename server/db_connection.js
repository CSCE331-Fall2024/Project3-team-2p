import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// class DBConnection {
//     constructor() {
//         this.pool = new Pool({
//             host: process.env.HOST,
//             user: process.env.DBUSER,
//             password: process.env.PASSWORD,
//             database: process.env.DATABASE,
//             port: process.env.DBPORT,
//         });
//     }
// }

class DBConnection {
    constructor() {
        this.pool = new Pool({
            host: 'csce-315-db.engr.tamu.edu',
            user: 'team_2p',
            password: 'pawmo',
            database: 'team_2p_db',
            port: 5432,
        });
    }
}

export default DBConnection;