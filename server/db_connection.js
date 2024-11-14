import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

class DBConnection {
    constructor() {
        this.pool = new Pool({
            host: process.env.HOST,
            user: process.env.DBUSER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.DBPORT,
        });
    }
 }

export default DBConnection;