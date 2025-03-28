const { Pool } = require("pg");
require ('dotenv').config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

//
const testConnection = async() => {
    try{
        const client = await pool.connect();
        console.log('connected to PostgreSQL database');
        client.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

testConnection();

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};