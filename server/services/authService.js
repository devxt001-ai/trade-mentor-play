import axios from 'axios';
import { authenticator } from 'otplib';
import NodeCache from 'node-cache';

// Cache for storing tokens to avoid unnecessary API calls
const tokenCache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

// Fyers API credentials from environment variables
const CLIENT_ID = process.env.FYERS_CLIENT_ID || 'YJ00857';
const APP_ID = process.env.FYERS_APP_ID || '6BQQUK21RL-100';
const SECRET_ID = process.env.FYERS_SECRET_ID || '0OITL01M6R';
const PIN = process.env.FYERS_PIN || '0000';
const TOTP_SECRET = process.env.FYERS_TOTP_SECRET || 'J3272VEVVSUWMIXJCBNFEJH7AAI2CBRS';
const REDIRECT_URI = process.env.FYERS_REDIRECT_URI || 'https://127.0.0.1:3000/';

// Fyers API endpoints
const API_BASE_URL = 'https://api.fyers.in/api/v2';
const AUTH_URL = 'https://api.fyers.in/api/v2/generate-authcode';
const TOKEN_URL = 'https://api.fyers.in/api/v2/validate-authcode';

/**
 * Generate TOTP code using the provided secret
 * @returns {string} TOTP code
 */
const generateTOTP = () => {
  return authenticator.generate(TOTP_SECRET);
};

/**
 * Authenticate user with Fyers API
 * @returns {Promise<Object>} Authentication result
 */
export const authenticateUser = async () => {
  try {
    // Check if we already have a valid token in cache
    const cachedToken = tokenCache.get('access_token');
    if (cachedToken) {
      return { success: true, token: cachedToken };
    }

    // Step 1: Generate auth code
    const authResponse = await axios.post(AUTH_URL, {
      app_id: APP_ID,
      redirect_uri: REDIRECT_URI,
    });

    if (!authResponse.data || !authResponse.data.data || !authResponse.data.data.request_key) {
      throw new Error('Failed to generate auth code');
    }

    const requestKey = authResponse.data.data.request_key;

    // Step 2: Generate TOTP
    const totp = generateTOTP();

    // Step 3: Verify TOTP
    const verifyResponse = await axios.post(`${API_BASE_URL}/verify-pin`, {
      request_key: requestKey,
      pin: PIN,
      identity_type: 'pin',
    });

    if (!verifyResponse.data || verifyResponse.data.code !== 200) {
      throw new Error('PIN verification failed');
    }

    // Step 4: Verify TOTP
    const totpResponse = await axios.post(`${API_BASE_URL}/verify-pin`, {
      request_key: requestKey,
      identity_type: 'totp',
      totp,
    });

    if (!totpResponse.data || totpResponse.data.code !== 200) {
      throw new Error('TOTP verification failed');
    }

    // Step 5: Generate token
    const tokenResult = await generateToken(requestKey);
    return tokenResult;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

/**
 * Generate access token using the request key
 * @param {string} requestKey - Request key from auth process
 * @returns {Promise<Object>} Token generation result
 */
export const generateToken = async (requestKey = null) => {
  try {
    // If no request key is provided, we need to authenticate first
    if (!requestKey) {
      const authResult = await authenticateUser();
      return authResult;
    }

    // Generate token using the request key
    const tokenResponse = await axios.post(TOKEN_URL, {
      grant_type: 'authorization_code',
      appIdHash: `${APP_ID}:${SECRET_ID}`,
      code: requestKey,
    });

    if (!tokenResponse.data || !tokenResponse.data.access_token) {
      throw new Error('Failed to generate token');
    }

    const accessToken = tokenResponse.data.access_token;
    
    // Cache the token
    tokenCache.set('access_token', accessToken);
    
    return {
      success: true,
      token: accessToken,
      expires_in: tokenResponse.data.expires_in || 86400, // Default to 24 hours
    };
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

/**
 * Verify if a token is valid
 * @param {string} token - Access token to verify
 * @returns {Promise<Object>} Verification result
 */
export const verifyToken = async (token) => {
  try {
    // Make a simple API call to verify the token
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      valid: true,
      user: response.data.data,
    };
  } catch (error) {
    // If the API call fails, the token is invalid
    return {
      valid: false,
      error: error.message,
    };
  }
};