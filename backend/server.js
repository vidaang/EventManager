require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

// Function to create a database connection
async function connectDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to AWS RDS database.');
        return connection;
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
}

// API route
app.get('/', async (req, res) => {
    res.send('Welcome to the Event Planner API!');
});

// Start server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});
