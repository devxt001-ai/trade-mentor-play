/**
 * Authentication middleware
 * Verifies that requests have a valid Supabase session token
 */

import { verifySession } from '../services/authService.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Get session token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in to access this resource.',
        code: 'NO_TOKEN'
      });
    }
    
    // Extract session token
    const sessionToken = authHeader.replace('Bearer ', '');
    
    try {
      // Verify session with Supabase
      const result = await verifySession(sessionToken);
      
      // Add user info to request object for use in route handlers
      req.user = result.user;
      req.sessionToken = sessionToken;
      
      // Session is valid, proceed
      next();
    } catch (verificationError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session. Please log in again.',
        code: 'INVALID_SESSION'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication service error',
      code: 'AUTH_SERVICE_ERROR'
    });
  }
};

// Optional middleware for routes that need Fyers token as well
const fyersAuthMiddleware = async (req, res, next) => {
  try {
    // First run the standard auth middleware
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Check if user has Fyers token
    const { getFyersToken } = require('../services/authService');
    
    try {
      const fyersToken = getFyersToken(req.user.id);
      req.fyersToken = fyersToken;
      next();
    } catch (fyersError) {
      return res.status(403).json({
        success: false,
        error: 'Fyers authentication required. Please complete Fyers OAuth flow.',
        code: 'FYERS_AUTH_REQUIRED'
      });
    }
  } catch (error) {
    next(error);
  }
};

export {
  authMiddleware,
  fyersAuthMiddleware
};