const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');  // Add this line
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const secret = process.env.JWT_SECRET || 'your_jwt_secret_key';

app.use(express.json());
app.use(cors());  // Enable CORS for all routes

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper function to format dates
function formatDate(date) {
  const options = {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(date));
  
  // Extract the month and day
  const [monthDay, time] = formattedDate.split(", ");
  return `${monthDay}, ${time} Hrs`;
}

// User registration
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id', [email, hashedPassword]);
    const userId = result.rows[0].id;
    const token = jwt.sign({ userId, email }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Registration error', err);
    res.status(500).send('Registration error');
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT id, password FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).send('Invalid credentials');
    }
    const { id, password: hashedPassword } = result.rows[0];
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: id, email }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).send('Login error');
  }
});

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send('Access token missing');
  }
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.user = user;
    next();
  });
};

// Endpoint to shorten URL (with user authentication)
app.post('/api/v1/data/shorten', authenticateJWT, async (req, res) => {
  const { longUrl } = req.body;
  const userId = req.user.userId;

  if (!longUrl) {
    return res.status(400).send('longUrl is required');
  }

  let client;
  try {
    client = await pool.connect();

    // Check if the user has exceeded the limit
    const linkCountResult = await client.query('SELECT COUNT(*) FROM urls WHERE user_id = $1', [userId]);
    const linkCount = parseInt(linkCountResult.rows[0].count, 10);

    if (linkCount >= 3 && !req.user) {
      return res.status(403).send('Guest users are limited to 3 links');
    }

    // Check if the long URL already exists
    const result = await client.query('SELECT short_url FROM urls WHERE long_url = $1 AND user_id = $2', [longUrl, userId]);
    if (result.rows.length > 0) {
      const { short_url } = result.rows[0];
      return res.json({ shortUrl: `${url}/${short_url}`, type: 'existing' });
    }

    // Generate new unique ID and short URL
    const uniqueId = generateUniqueId();
    const shortUrl = toBase62(uniqueId);

    // Insert into the database with the current timestamp
    await client.query('INSERT INTO urls (id, short_url, long_url, created_at, clicks, user_id) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0, $4)', [uniqueId, shortUrl, longUrl, userId]);

    res.json({ shortUrl: `${url}/${shortUrl}`, type: 'new' });

  } catch (err) {
    console.error('Database query error', err);
    res.status(500).send('Database error');
  } finally {
    if (client) {
      client.release();
    }
  }
});

// Endpoint to fetch the last 5 shortened URLs (guest users and authenticated users)
app.get('/api/v1/data/last5', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;

  let client;
  try {
    client = await pool.connect();

    // Fetch the last 5 shortened URLs for the authenticated user
    const result = await client.query(`
      SELECT short_url, long_url, created_at 
      FROM urls 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 5
    `, [userId]);

    // Format the result
    const links = result.rows.map(row => ({
      shortLink: `${url}/${row.short_url}`,
      originalLink: row.long_url,
      dateCreated: formatDate(row.created_at)
    }));

    res.json(links);
  } catch (err) {
    console.error('Database query error', err);
    res.status(500).send('Database error');
  } finally {
    if (client) {
      client.release();
    }
  }
});

// Endpoint to delete an entry based on short link (authenticated users only)
app.delete('/api/v1/data/delete/:shortUrl', authenticateJWT, async (req, res) => {
  const { shortUrl } = req.params;
  const userId = req.user.userId;

  let client;
  try {
    client = await pool.connect();

    // Delete the entry from the database
    const result = await client.query('DELETE FROM urls WHERE short_url = $1 AND user_id = $2 RETURNING *', [shortUrl, userId]);

    if (result.rowCount > 0) {
      res.status(200).send(`Entry with short URL ${shortUrl} deleted successfully.`);
    } else {
      res.status(404).send('Short URL not found or you do not have permission to delete this link');
    }
  } catch (err) {
    console.error('Database query error', err);
    res.status(500).send('Database error');
  } finally {
    if (client) {
      client.release();
    }
  }
});

app.listen(port, () => {
  console.log(`minimaLINK listening at ${url}`);
});