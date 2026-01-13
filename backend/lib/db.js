/**
 * MongoDB Connection Module
 * Implements connection pooling and caching for serverless environments.
 * This prevents reconnection on every request and manages the mongoose connection globally.
 */

const mongoose = require('mongoose');

// Global connection cache
let cachedConnection = null;

/**
 * Connect to MongoDB with error handling and validation
 * In serverless, this is called once per warm container
 */
async function connectDB() {
  // Return cached connection if available
  if (cachedConnection) {
    console.log('[DB] Using cached MongoDB connection');
    return cachedConnection;
  }

  // Validate required environment variables
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  try {
    console.log('[DB] Connecting to MongoDB...');

    // Configure Mongoose to prevent buffering and timeout issues in serverless
    mongoose.set('strictQuery', true);

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pooling for better performance
      maxPoolSize: 5,
      minPoolSize: 1,
      // Timeout settings to prevent hanging connections
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Prevent buffering operations when disconnected
      bufferCommands: false,
      // Auto-reconnect on disconnection
      retryWrites: true,
      retryReads: true,
    });

    cachedConnection = connection;
    console.log('[DB] MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('[DB] MongoDB connection failed:', error.message);
    throw error;
  }
}

/**
 * Get the current mongoose instance
 * Returns cached connection or throws error if not connected
 */
function getDB() {
  if (!cachedConnection) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return cachedConnection;
}

/**
 * Gracefully disconnect from MongoDB (for testing or shutdown)
 */
async function disconnectDB() {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    console.log('[DB] MongoDB disconnected');
  }
}

module.exports = {
  connectDB,
  getDB,
  disconnectDB,
  mongoose,
};
