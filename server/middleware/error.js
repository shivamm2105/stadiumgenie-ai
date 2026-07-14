// Global Error Handler Middleware

export default function errorHandler(err, req, res, next) {
  console.error('❌ Express Server Error:', err.message, err.stack);
  
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    error: {
      message,
      status,
      timestamp: new Date().toISOString()
    }
  });
}
