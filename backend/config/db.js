// backend/config/db.js
// This file would be for direct MySQL connection if you're not using Sequelize exclusively
// For full Sequelize usage, models/index.js handles the connection.
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' }); // Adjust path as necessary if not in root backend folder

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Connected...');
        connection.release(); // Release connection back to pool
    } catch (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1); // Exit process if connection fails
    }
};

module.exports = {
    pool,
    connectDB
};