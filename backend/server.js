/**
 * TaskEasy Backend - Vercel-Ready Express Application
 * 
 * This is the main entry point for the Express app.
 * It exports the app for both:
 * - Local development: vercel dev
 * - Vercel serverless: Automatic handler
 * 
 * NO app.listen() here - Vercel handles HTTP server startup
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Database
const { connectDB } = require('./lib/db');

// Routes
const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const wikiRoutes = require('./routes/wiki');
const workitemsRoutes = require('./routes/workitems');
const boardsRoutes = require('./routes/boards');
const sprintsRoute = require('./routes/sprints');
const pipelinesRoute = require('./routes/pipelines');
const deliveryPlansRoute = require('./routes/deliveryplans');

// Middleware
const { errorHandler, validateEnv } = require('./middleware/errorHandler');

const app = express();

// ============================================================================
// CONFIGURATION & VALIDATION
// ============================================================================

// Validate required environment variables at startup
validateEnv();

// ============================================================================
// CORS CONFIGURATION
// ============================================================================

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',      // Local Vite dev server
      'http://localhost:3000',      // Alt local dev
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL,     // Deployed frontend (set via env var)
    ].filter(Boolean); // Remove undefined values

    // Allow requests without Origin (e.g., mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// ============================================================================
// BUILT-IN MIDDLEWARE
// ============================================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================================================
// STATIC FILES
// ============================================================================

// Serve uploads folder statically
// Note: For production, consider using S3/cloud storage instead of local uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

app.get('/api/health', async (req, res) => {
  try {
    // Ensure database is connected
    await connectDB();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ============================================================================
// DATABASE CONNECTION MIDDLEWARE
// ============================================================================

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('[APP] Database connection failed:', error.message);
    return res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable',
    });
  }
});

// ============================================================================
// API ROUTES
// ============================================================================

// Authentication routes
app.use('/api/auth', authRoutes);

// Workitems, boards and sprints routes
// Must come BEFORE /api/projects to prevent route conflicts
app.use('/api', workitemsRoutes);
app.use('/api', boardsRoutes);
app.use('/api/projects/:projectId/sprints', sprintsRoute);
app.use('/api/projects/:projectId/delivery-plans', deliveryPlansRoute);

// Project-scoped services
app.use('/api/projects/:projectId/wiki', wikiRoutes);
app.use('/api/projects/:projectId/pipelines', pipelinesRoute);

// Projects routes (must come last to avoid shadowing)
app.use('/api/projects', projectsRoutes);

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

app.use(errorHandler);

// ============================================================================
// EXPORT FOR SERVERLESS
// ============================================================================

module.exports = app;

// ============================================================================
// LOCAL DEVELOPMENT
// ============================================================================

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║       TaskEasy Backend Server Started      ║
╚════════════════════════════════════════════╝
Environment: ${NODE_ENV}
Port: ${PORT}
API Base: http://localhost:${PORT}/api
Health Check: http://localhost:${PORT}/api/health
    `);
  });
}