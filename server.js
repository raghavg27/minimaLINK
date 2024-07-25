// server.js

const express = require('express');
const validUrl = require('valid-url');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());  // Enable CORS for all routes

//url 
// const url = process.env.API_URL + ":" + process.env.PORT
const url = process.env.API_URL.includes('http') ? process.env.API_URL : `http://${process.env.API_URL}`;

// PostgreSQL client setup
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

// Base62 characters
const base62chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Convert a number to base62
function toBase62(num) {
  if (num === 0) return base62chars[0];
  let base62 = '';
  while (num > 0) {
    base62 = base62chars[num % 62] + base62;
    num = Math.floor(num / 62);
  }
  return base62;
}

// Generate a unique ID
function generateUniqueId() {
  const currentTime = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  return currentTime * 10000 + randomNum;
}

// Endpoint to shorten URL
app.post('/api/v1/data/shorten', async (req, res) => {
  let { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).send('longUrl is required');
  }

  // Prepend protocol if missing
  if (!validUrl.isUri(longUrl)) {
    longUrl = 'http://' + longUrl;
    if (!validUrl.isUri(longUrl)) {
      return res.status(400).send('A valid longUrl is required');
    }
  }

  let client;
  try {
    client = await pool.connect();

    // Check if the long URL already exists
    const result = await client.query('SELECT short_url FROM urls WHERE long_url = $1', [longUrl]);
    if (result.rows.length > 0) {
      const { short_url } = result.rows[0];
      return res.json({ shortUrl: `${url}/${short_url}`, type: 'existing' });
    }

    // Generate new unique ID and short URL
    const uniqueId = generateUniqueId();
    const shortUrl = toBase62(uniqueId);

    // Insert into the database
    await client.query('INSERT INTO urls (id, short_url, long_url) VALUES ($1, $2, $3)', [uniqueId, shortUrl, longUrl]);

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

// Endpoint to redirect to the original URL
app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  console.log(`Received request to redirect short URL: ${shortUrl}`);

  let client;
  try {
    client = await pool.connect();

    // Fetch the long URL from the database
    const result = await client.query('SELECT long_url FROM urls WHERE short_url = $1', [shortUrl]);
    console.log(`Database query result: ${JSON.stringify(result.rows)}`);

    if (result.rows.length > 0) {
      let { long_url } = result.rows[0];
      console.log(`Redirecting to long URL: ${long_url}`);

      // Prepend protocol if missing
      if (!long_url.startsWith('http://') && !long_url.startsWith('https://')) {
        long_url = 'http://' + long_url;
      }

      return res.redirect(301, long_url);
    }

    console.log('Short URL not found');
    res.status(404).send('Short URL not found');
  } catch (err) {
    console.error('Database query error', err);
    res.status(500).send('Database error');
  } finally {
    if (client) {
      client.release();
    }
  }
});


// Endpoint to fetch the last 5 shortened URLs
app.get('/api/v1/data/last5', async (req, res) => {
  let client;
  try {
    client = await pool.connect();

    // Fetch the last 5 shortened URLs
    const result = await client.query(`
      SELECT short_url, long_url, created_at 
      FROM urls 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // Format the result
    const links = result.rows.map(row => ({
      shortLink: `${url}/${row.short_url}`,
      originalLink: row.long_url,
      dateCreated: row.created_at
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

app.listen(port, () => {
  console.log(`minimaLINK listening at ${url}`);
});
