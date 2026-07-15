// Global Error Handler Middleware

export default function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Hide stack trace for client-side status codes (400, 404, etc.) to keep logs clean in production
  if (status >= 500 || process.env.NODE_ENV === 'development') {
    console.error('❌ Express Server Error:', err.message, err.stack);
  } else {
    console.warn(`⚠️ Request Warning [${status}]: ${err.message}`);
  }
  
  res.status(status).json({
    error: {
      message: status >= 500 ? 'Internal Server Error' : message,
      status,
      timestamp: new Date().toISOString()
    }
  });
}
