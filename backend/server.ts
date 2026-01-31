import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const { DATABASE_URL, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT = 5432, JWT_SECRET = 'menalane-secret-key-change-in-production' } = process.env;

const pool = new Pool(
  DATABASE_URL
    ? { 
        connectionString: DATABASE_URL, 
        ssl: { require: true } 
      }
    : {
        host: PGHOST,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        port: Number(PGPORT),
        ssl: { require: true },
      }
);

// const client = await pool.connect();

const app = express();

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
  credentials: true,
}));
app.use(express.json());

// Auth middleware
const authenticate_token = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1', 
      [decoded.user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Database initialization
const initialize_database = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

// Routes

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt_rounds = 12;
    const hashed_password = await bcrypt.hash(password, salt_rounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email.toLowerCase().trim(), hashed_password, name.trim()]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check password
    const is_valid_password = await bcrypt.compare(password, user.password);
    if (!is_valid_password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', authenticate_token, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      created_at: req.user.created_at
    }
  });
});

// Get current user endpoint
app.get('/api/auth/me', authenticate_token, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      created_at: req.user.created_at
    }
  });
});

// Update user profile endpoint
app.put('/api/auth/profile', authenticate_token, async (req, res) => {
  try {
    const { name } = req.body;
    const user_id = req.user.id;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const result = await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name, created_at',
      [name.trim(), user_id]
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        created_at: result.rows[0].created_at
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Example protected endpoint
app.get('/api/protected', authenticate_token, (req, res) => {
  res.json({
    message: 'This is a protected endpoint',
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    },
    timestamp: new Date().toISOString()
  });
});

// ============================================
// MENALANE API ENDPOINTS
// ============================================

// Get featured content for homepage
app.get('/api/content/featured', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, slug, excerpt, author, featured_image, content_type, region, industry, published_at 
       FROM content 
       WHERE is_featured = TRUE AND published_at IS NOT NULL 
       ORDER BY published_at DESC 
       LIMIT 4`
    );
    res.json({ content: result.rows });
  } catch (error) {
    console.error('Error fetching featured content:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all content with filters
app.get('/api/content', async (req, res) => {
  try {
    const { type, region, industry, search, limit = 20, offset = 0 } = req.query;
    let query = `SELECT id, title, slug, excerpt, author, featured_image, content_type, region, industry, published_at, views 
                 FROM content 
                 WHERE published_at IS NOT NULL`;
    const params: any[] = [];
    let paramCount = 1;

    if (type) {
      query += ` AND content_type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    if (region && region !== 'general') {
      query += ` AND region = $${paramCount}`;
      params.push(region);
      paramCount++;
    }

    if (industry && industry !== 'general') {
      query += ` AND industry = $${paramCount}`;
      params.push(industry);
      paramCount++;
    }

    if (search) {
      query += ` AND (title ILIKE $${paramCount} OR excerpt ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY published_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(`SELECT COUNT(*) FROM content WHERE published_at IS NOT NULL`);
    
    res.json({ 
      content: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single content by slug
app.get('/api/content/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      `SELECT * FROM content WHERE slug = $1 AND published_at IS NOT NULL`,
      [slug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Increment views
    await pool.query(`UPDATE content SET views = views + 1 WHERE slug = $1`, [slug]);

    // Get related content
    const content = result.rows[0];
    const relatedResult = await pool.query(
      `SELECT id, title, slug, excerpt, featured_image, published_at 
       FROM content 
       WHERE published_at IS NOT NULL 
       AND slug != $1 
       AND (region = $2 OR industry = $3) 
       ORDER BY published_at DESC 
       LIMIT 4`,
      [slug, content.region, content.industry]
    );

    res.json({ 
      content: content,
      related: relatedResult.rows
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get market highlights
app.get('/api/market-highlights', async (req, res) => {
  try {
    const { region } = req.query;
    let query = `SELECT * FROM market_highlights`;
    const params: any[] = [];

    if (region) {
      query += ` WHERE region = $1`;
      params.push(region);
    }

    query += ` ORDER BY display_order ASC`;

    const result = await pool.query(query, params);
    res.json({ highlights: result.rows });
  } catch (error) {
    console.error('Error fetching market highlights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get job listings
app.get('/api/jobs', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM jobs WHERE is_active = TRUE ORDER BY created_at DESC`
    );
    res.json({ jobs: result.rows });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    await pool.query(
      `INSERT INTO contact_submissions (name, email, company, subject, message) 
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, company || null, subject || null, message]
    );

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Newsletter subscription
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    await pool.query(
      `INSERT INTO newsletter_subscriptions (email) 
       VALUES ($1) 
       ON CONFLICT (email) DO UPDATE SET subscribed = TRUE, updated_at = CURRENT_TIMESTAMP`,
      [email.toLowerCase().trim()]
    );

    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "MENALANE API - Connecting Global Capital to MENA Opportunities" });
});

// Catch-all route for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export { app, pool };

// Start the server
app.listen(3000, '0.0.0.0', () => {
  console.log(`Server running on port 3000 and listening on 0.0.0.0`);
});
