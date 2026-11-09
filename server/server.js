const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// 1. Load Environment Variables
dotenv.config();

const app = express();

// Webhook raw body parsers (must come before JSON parser)
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
app.use('/api/payment/payfast-webhook', express.raw({ type: 'application/x-www-form-urlencoded' }));

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: "Too many requests from this IP. Please try again later." }
});
app.use('/api', limiter);

// Request parsing with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS Configuration - Allow both localhost and production URLs
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://scentia-fragrances-git-main-tahabinkhalids-projects.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log(`Blocked origin: ${origin}`);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// NoSQL Injection Protection
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (var key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };
  sanitize(req.body);
  sanitize(req.params);
  sanitize(req.query);
  next();
});

// HTTP Parameter Pollution protection
app.use(hpp());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// API Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Scentia Secure API is active',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Scentia Secure API is active',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// ========== PRODUCTION: Serve Frontend Static Files ==========
if (process.env.NODE_ENV === 'production') {
  // Define the path to the frontend build folder
  const frontendBuildPath = path.join(__dirname, '../frontend/build');

  // Serve static files
  app.use(express.static(frontendBuildPath));

  // Handle React routing - return all non-API requests to React app
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    // Skip webhook routes
    if (req.path.includes('/webhook')) {
      return res.status(404).json({ message: 'Webhook endpoint' });
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO Setup with production-ready configuration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Make io accessible to all routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected to Scentia Real-time:', socket.id);

  socket.on('join_user_room', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined their private concierge room.`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Server Initialization
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🛡️ Security layer: ACTIVE`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS allowed origins:`, allowedOrigins);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('📴 Received SIGINT. Shutting down gracefully...');
  server.close(async () => {
    await mongoose.connection.close();
    console.log('✅ Safe shutdown complete.');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('📴 Received SIGTERM. Shutting down gracefully...');
  server.close(async () => {
    await mongoose.connection.close();
    console.log('✅ Safe shutdown complete.');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  process.exit(1);
});