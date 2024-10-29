import pkg from 'pg';
const { Pool } = pkg;

class DBConnection {
    constructor() {
        this.pool = new Pool({
            host: "csce-315-db.engr.tamu.edu",
            user: "team_2p",
            password: "pawmo",
            database: "team_2p_db",
            port: 5432,
          });
    }
}

export default DBConnection;