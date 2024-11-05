class ErrorMiddleware {
    static handleError(err, req, res, next) {
      console.error(err.stack);
  
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    }
  }
  
  module.exports = ErrorMiddleware;
  