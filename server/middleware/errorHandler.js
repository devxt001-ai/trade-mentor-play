/**
 * Global error handling middleware
 * Standardizes error responses across the API
 */

const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Structured error response
  const errorResponse = {
    success: false,
    error: {
      message,
      status,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    errorResponse.error.status = 400;
    errorResponse.error.details = err.details;
  } else if (err.name === 'AuthenticationError') {
    errorResponse.error.status = 401;
  } else if (err.name === 'ForbiddenError') {
    errorResponse.error.status = 403;
  } else if (err.name === 'NotFoundError') {
    errorResponse.error.status = 404;
  }

  res.status(errorResponse.error.status).json(errorResponse);
};

module.exports = errorHandler;