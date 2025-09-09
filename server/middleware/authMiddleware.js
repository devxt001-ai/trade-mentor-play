/**
 * Authentication middleware
 * Verifies that requests have a valid access token
 */

const { tokenCache } = require('../services/authService');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('No token provided');
      error.name = 'AuthenticationError';
      error.statusCode = 401;
      return next(error);
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Check if token exists in cache
    const cachedToken = tokenCache.get('access_token');
    
    if (!cachedToken || cachedToken !== token) {
      const error = new Error('Invalid or expired token');
      error.name = 'AuthenticationError';
      error.statusCode = 401;
      return next(error);
    }
    
    // Token is valid, proceed
    next();
  } catch (error) {
    error.name = 'AuthenticationError';
    error.statusCode = 401;
    next(error);
  }
};

module.exports = authMiddleware;