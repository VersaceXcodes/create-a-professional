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
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const { DATABASE_URL, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT = 5432, JWT_SECRET = 'menalane-secret-key-change-in-production' } = process.env;

const pool = new Pool(
  DATABASE_URL
    ? { 
        connectionString: DATABASE_URL, 
        ssl: { rejectUnauthorized: false } 
      }
    : {
        host: PGHOST,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        port: Number(PGPORT),
        ssl: { rejectUnauthorized: false },
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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
  credentials: true,
}));
app.use(express.json());

// Auth middleware
const authenticate_token = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
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
app.get('/api/auth/verify', authenticate_token, (req: any, res) => {
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
app.get('/api/auth/me', authenticate_token, (req: any, res) => {
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
app.put('/api/auth/profile', authenticate_token, async (req: any, res) => {
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
app.get('/api/protected', authenticate_token, (req: any, res) => {
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

// ============================================
// CMS API ENDPOINTS
// ============================================

// Get CMS stats
app.get('/api/cms/stats', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM content');
    const publishedResult = await pool.query('SELECT COUNT(*) FROM content WHERE published_at IS NOT NULL');
    const draftResult = await pool.query('SELECT COUNT(*) FROM content WHERE published_at IS NULL');
    const mediaResult = await pool.query('SELECT COUNT(*) FROM media');

    res.json({
      stats: {
        totalContent: parseInt(totalResult.rows[0].count),
        publishedContent: parseInt(publishedResult.rows[0].count),
        draftContent: parseInt(draftResult.rows[0].count),
        totalMedia: parseInt(mediaResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error fetching CMS stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all content for CMS (including drafts)
app.get('/api/cms/content', async (req, res) => {
  try {
    const { type, region, industry, search, limit = 50, offset = 0 } = req.query;
    let query = `SELECT * FROM content WHERE 1=1`;
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

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    res.json({ 
      content: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching CMS content:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single content for CMS by ID
app.get('/api/cms/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM content WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ content: result.rows[0] });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new content
app.post('/api/cms/content', async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      author,
      featured_image,
      content_type,
      region,
      industry,
      is_featured,
      published_at
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const result = await pool.query(
      `INSERT INTO content (
        title, slug, excerpt, content, author, featured_image,
        content_type, region, industry, is_featured, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        title,
        finalSlug,
        excerpt || null,
        content,
        author || null,
        featured_image || null,
        content_type || 'article',
        region || 'general',
        industry || 'general',
        is_featured || false,
        published_at || null
      ]
    );

    res.status(201).json({ 
      message: 'Content created successfully',
      content: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error creating content:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'A content item with this slug already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update content
app.put('/api/cms/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      author,
      featured_image,
      content_type,
      region,
      industry,
      is_featured,
      published_at
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const result = await pool.query(
      `UPDATE content SET
        title = $1,
        slug = $2,
        excerpt = $3,
        content = $4,
        author = $5,
        featured_image = $6,
        content_type = $7,
        region = $8,
        industry = $9,
        is_featured = $10,
        published_at = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *`,
      [
        title,
        slug,
        excerpt || null,
        content,
        author || null,
        featured_image || null,
        content_type || 'article',
        region || 'general',
        industry || 'general',
        is_featured || false,
        published_at || null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ 
      message: 'Content updated successfully',
      content: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error updating content:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'A content item with this slug already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete content
app.delete('/api/cms/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM content WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============================================
// CMS MEDIA LIBRARY ENDPOINTS
// ============================================

// Get all media files
app.get('/api/cms/media', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM media ORDER BY created_at DESC'
    );
    res.json({ media: result.rows });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload media file
app.post('/api/cms/media/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO media (filename, original_filename, file_type, file_size, url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        fileUrl
      ]
    );

    res.status(201).json({
      message: 'File uploaded successfully',
      media: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    // Clean up uploaded file if database insert fails
    if (req.file) {
      const filePath = path.join(__dirname, 'public', 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete media file
app.delete('/api/cms/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get file info first
    const fileResult = await pool.query('SELECT * FROM media WHERE id = $1', [id]);
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = fileResult.rows[0];
    
    // Delete from database
    await pool.query('DELETE FROM media WHERE id = $1', [id]);
    
    // Delete physical file
    const filePath = path.join(__dirname, 'public', 'uploads', file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
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
