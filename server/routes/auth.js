import express from 'express';
import {
  registerUser,
  loginUser,
  generateFyersAuthUrl,
  exchangeFyersAuthCode,
  getFyersToken,
  verifySession,
  logoutUser
} from '../services/authService.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register new user with Supabase Auth and generate client ID
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const result = await registerUser(email, password, fullName);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: result.user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user with email or client ID and password
 */
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email/Client ID and password are required'
      });
    }
    
    const result = await loginUser(identifier, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: result.user,
      session: result.session
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/auth/fyers-auth-url
 * @desc Generate Fyers OAuth URL for user
 */
router.post('/fyers-auth-url', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    const result = await generateFyersAuthUrl(userId);
    
    res.json({
      success: true,
      authUrl: result.authUrl,
      state: result.state
    });
  } catch (error) {
    console.error('Fyers auth URL generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/auth/fyers-token
 * @desc Exchange Fyers auth code for access token
 */
router.post('/fyers-token', async (req, res) => {
  try {
    const { authCode, userId } = req.body;
    
    if (!authCode || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Auth code and user ID are required'
      });
    }
    
    const result = await exchangeFyersAuthCode(authCode, userId);
    
    res.json({
      success: true,
      message: 'Fyers authentication successful',
      access_token: result.access_token
    });
  } catch (error) {
    console.error('Fyers token exchange error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/auth/verify
 * @desc Verify Supabase session token
 */
router.get('/verify', async (req, res) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        error: 'No session token provided'
      });
    }
    
    const result = await verifySession(sessionToken);
    
    res.json({
      success: true,
      user: result.user
    });
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user and clear tokens
 */
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId || !sessionToken) {
      return res.status(400).json({
        success: false,
        error: 'User ID and session token are required'
      });
    }
    
    await logoutUser(userId, sessionToken);
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;