import express from 'express';
import { authenticateUser, generateToken, verifyToken } from '../services/authService.js';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Authenticate with Fyers API and get access token
 */
router.post('/login', async (req, res, next) => {
  try {
    const result = await authenticateUser();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/token
 * @desc Generate a new access token using the provided credentials
 */
router.post('/token', async (req, res, next) => {
  try {
    const result = await generateToken();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/auth/verify
 * @desc Verify if the current token is valid
 */
router.get('/verify', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: true, message: 'No token provided' });
    }
    
    const result = await verifyToken(token);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;