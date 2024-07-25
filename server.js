const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());  // Enable CORS for all routes

const url = process.env.API_URL;

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

// Helper function to format dates
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(new Date(date));
}

// Endpoint to shorten URL
app.post('/api/v1/data/shorten', async (req, res) => {
  let { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).send('longUrl is required');
  }

  if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
    longUrl = 'http://' + longUrl;
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

    // Insert into the database with the current timestamp
    await client.query('INSERT INTO urls (id, short_url, long_url, created_at, clicks) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0)', [uniqueId, shortUrl, longUrl]);

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
    const result = await client.query('SELECT long_url, clicks FROM urls WHERE short_url = $1', [shortUrl]);
    console.log(`Database query result: ${JSON.stringify(result.rows)}`);

    if (result.rows.length > 0) {
      let { long_url, clicks } = result.rows[0];
      console.log(`Redirecting to long URL: ${long_url}`);

      // Increment the click count
      await client.query('UPDATE urls SET clicks = $1 WHERE short_url = $2', [clicks + 1, shortUrl]);

      // Prepend protocol if missing
      if (!long_url.startsWith('http://') && !long_url.startsWith('https://')) {
        long_url = 'http://' + long_url;
      }

      return res.redirect(302, long_url);
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
      SELECT short_url, long_url, created_at, clicks 
      FROM urls 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // Format the result
    const links = result.rows.map(row => ({
      shortLink: `${url}/${row.short_url}`,
      originalLink: row.long_url,
      dateCreated: formatDate(row.created_at),
      clicks: row.clicks
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

// Endpoint to delete an entry based on short link
app.delete('/api/v1/data/delete/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  let client;
  try {
    client = await pool.connect();

    // Delete the entry from the database
    const result = await client.query('DELETE FROM urls WHERE short_url = $1 RETURNING *', [shortUrl]);

    if (result.rowCount > 0) {
      res.status(200).send(`Entry with short URL ${shortUrl} deleted successfully.`);
    } else {
      res.status(404).send('Short URL not found');
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