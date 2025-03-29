require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 5000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

const pool = mysql.createPool(dbConfig);

// Function to create a database connection
const connectDB = async () => {
    try {
        await pool.getConnection();
        console.log('Connected to AWS RDS database.');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
};

// API route
server.get('/', async (req, res) => {
    res.send('Welcome to the Event Planner API!');
});

// Start server
server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});


///////////////////////////////////////////////////


//authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

//error handling
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
};

//validation
const validateUser = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('first_name').trim().notEmpty(),
    body('last_name').trim().notEmpty(),
    body('role').isIn(['admin', 'university', 'rso', 'student'])
];

const validateEvent = [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('category').isIn(['social', 'fundraising', 'tech talk', 'other']),
    body('date_time').isISO8601(),
    body('visibility').isIn(['public', 'private', 'rso'])
];

//authentication routes
server.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await pool.execute(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.user_id, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//user routes
server.post('/api/users/register', validateUser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { first_name, last_name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            'INSERT INTO Users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, role]
        );
        res.status(201).json({ user_id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

//univerity routes
server.post('/api/universities', authenticateToken, async (req, res) => {
    try {
        const { name, location, description, num_students, image_url } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO Universities (name, location, description, num_students, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, location, description, num_students, image_url, req.user.user_id]
        );
        res.status(201).json({ university_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/universities', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Universities WHERE status = "active"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//RSO routes
server.post('/api/rsos', authenticateToken, async (req, res) => {
    try {
        const { name, university_id } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO RSOs (name, university_id, admin_id) VALUES (?, ?, ?)',
            [name, university_id, req.user.user_id]
        );
        res.status(201).json({ rso_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/rsos', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM RSOs WHERE status = "active"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//event routes
server.post('/api/events', [authenticateToken, validateEvent], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            name, description, category, date_time, location_name,
            latitude, longitude, contact_phone, contact_email,
            visibility, university_id, rso_id
        } = req.body;
        
        const [result] = await pool.execute(
            `INSERT INTO Events (name, description, category, date_time, location_name,
                latitude, longitude, contact_phone, contact_email, visibility,
                university_id, rso_id, created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, category, date_time, location_name,
             latitude, longitude, contact_phone, contact_email,
             visibility, university_id, rso_id, req.user.user_id]
        );
        res.status(201).json({ event_id: result.insertId });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/events', authenticateToken, async (req, res) => {
    try{
        const { university_id, rso_id } = req.query;
        let query = 'SELECT * FROM Events WHERE 1=1';
        const params = [];

        if (university_id) {
            query += ' AND university_id = ?';
            params.push(university_id);
        }

        if (rso_id) {
            query += ' AND rso_id = ?';
            params.push(rso_id);
        }

        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

server.put('/api/events/:event_id', authenticateToken, async (req, res) => {
    try{
        const { event_id } = req.params;
        const updates = req.body;
        
        //check permission for user
        const [event] = await pool.execute(
            'SELECT * FROM Events WHERE event_id = ?',
            [event_id]
        );

        if (event[0].created_by !== req.user.user_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to update this event' });
        }

        const [result] = await pool.execute(
            'UPDATE Events SET ? WHERE event_id = ?',
            [updates, event_id]
        );
        res.json({ updated: result.affectedRows > 0 });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

//event comments
server.post('/api/events/:event_id/comments', authenticateToken, async (req, res) => {
    try{
        const { comment } = req.body;
        const { event_id } = req.params;
        const [result] = await pool.execute(
            'INSERT INTO EventComments (event_id, user_id, comment) VALUES (?, ?, ?)',
            [event_id, req.user.user_id, comment]
        );
        res.status(201).json({ comment_id: result.insertId });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/events/:event_id/comments', async (req, res) => {
    try {
        const { event_id } = req.params;
        const [rows] = await pool.execute(
            `SELECT c.*, u.first_name, u.last_name 
             FROM EventComments c 
             JOIN Users u ON c.user_id = u.user_id 
             WHERE c.event_id = ?
             ORDER BY c.created_at DESC`,
            [event_id]
        );
        res.json(rows);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

//event ratings
server.post('/api/events/:event_id/ratings', authenticateToken, async (req, res) => {
    try{
        const { rating } = req.body;
        const { event_id } = req.params;
        
        if(rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const [result] = await pool.execute(
            'INSERT INTO EventRatings (event_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
            [event_id, req.user.user_id, rating, rating]
        );
        res.status(201).json({ rating_id: result.insertId });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/events/:event_id/ratings', async (req, res) =>{
    try{
        const { event_id } = req.params;
        const [rows] = await pool.execute(
            'SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings FROM EventRatings WHERE event_id = ?',
            [event_id]
        );
        res.json(rows[0]);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

//error handling
server.use(errorHandler);

