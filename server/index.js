import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

import statusRoutes from './routes/statusRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import errorHandler from './middleware/error.js';

// Resolve current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility Middlewares - Disable CSP to allow loading UI scripts & style assets
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: '*', // Allow all origins for the hackathon preview
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static assets from client/dist in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// API Routes
app.use('/api/status', statusRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Fallback for SPA routing - all GET requests that don't match API or static files should serve index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Fallback for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 StadiumGenie Operations Backend running on port ${PORT}`);
  console.log(`📡 Health Check available at http://localhost:${PORT}/health`);
});
