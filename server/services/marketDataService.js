import axios from 'axios';
import NodeCache from 'node-cache';
import { tokenCache } from './authService.js';

// Cache for market data to reduce API calls
const marketDataCache = new NodeCache({ stdTTL: 60 }); // 60 seconds TTL

// Fyers API base URL
const API_BASE_URL = 'https://api.fyers.in/api/v2';

// Available stock symbols with metadata
const AVAILABLE_STOCKS = [
  { symbol: 'NSE:TCS-EQ', name: 'Tata Consultancy Services', sector: 'IT' },
  { symbol: 'NSE:INFY-EQ', name: 'Infosys', sector: 'IT' },
  { symbol: 'NSE:HDFCBANK-EQ', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'NSE:ICICIBANK-EQ', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'NSE:BHARTIARTL-EQ', name: 'Bharti Airtel', sector: 'Telecom' },
  { symbol: 'NSE:HINDUNILVR-EQ', name: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'NSE:KOTAKBANK-EQ', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'NSE:RELIANCE-EQ', name: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'NSE:SUNPHARMA-EQ', name: 'Sun Pharmaceutical', sector: 'Healthcare' },
  { symbol: 'NSE:TATAMOTORS-EQ', name: 'Tata Motors', sector: 'Auto' }
];

/**
 * Get the access token from cache or generate a new one
 * @returns {Promise<string>} Access token
 */
const getAccessToken = async () => {
  let token = tokenCache.get('access_token');
  if (!token) {
    // If no token in cache, import dynamically to avoid circular dependency
    const { authenticateUser } = await import('./authService.js');
    const authResult = await authenticateUser();
    token = authResult.token;
  }
  return token;
};

/**
 * Get market data for multiple symbols
 * @param {string[]} symbols - Array of stock symbols
 * @returns {Promise<Object>} Market data for the requested symbols
 */
export const getMarketData = async (symbols) => {
  try {
    const cacheKey = `market_data_${symbols.join('_')}`;
    const cachedData = marketDataCache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    const token = await getAccessToken();
    
    const response = await axios.get(`${API_BASE_URL}/quotes`, {
      params: {
        symbols: symbols.join(','),
        ohlcv_flag: 1, // Include OHLC data
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.data || response.data.s !== 'ok') {
      throw new Error('Failed to fetch market data');
    }
    
    // Process and format the data
    const formattedData = response.data.d.map(item => ({
      symbol: item.n,
      price: item.lp,
      change: item.ch,
      percentChange: item.chp,
      volume: item.v,
      open: item.o,
      high: item.h,
      low: item.l,
      previousClose: item.pc,
      timestamp: item.tt,
    }));
    
    // Cache the result
    marketDataCache.set(cacheKey, formattedData);
    
    return formattedData;
  } catch (error) {
    console.error('Market data error:', error);
    throw new Error(`Failed to fetch market data: ${error.message}`);
  }
};

/**
 * Get detailed quotes for specific symbols
 * @param {string[]} symbols - Array of stock symbols
 * @returns {Promise<Object>} Detailed quotes for the requested symbols
 */
export const getQuotes = async (symbols) => {
  try {
    const cacheKey = `quotes_${symbols.join('_')}`;
    const cachedData = marketDataCache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    const token = await getAccessToken();
    
    const response = await axios.get(`${API_BASE_URL}/quotes-detailed`, {
      params: {
        symbols: symbols.join(','),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.data || response.data.s !== 'ok') {
      throw new Error('Failed to fetch quotes');
    }
    
    // Cache the result
    marketDataCache.set(cacheKey, response.data.d);
    
    return response.data.d;
  } catch (error) {
    console.error('Quotes error:', error);
    throw new Error(`Failed to fetch quotes: ${error.message}`);
  }
};

/**
 * Get historical data for a symbol
 * @param {string} symbol - Stock symbol
 * @param {string} resolution - Time resolution (1, 5, 15, 30, 60, D, W, M)
 * @param {number} from - Start timestamp
 * @param {number} to - End timestamp
 * @returns {Promise<Object>} Historical data for the requested symbol
 */
export const getHistoricalData = async (symbol, resolution, from, to) => {
  try {
    const cacheKey = `history_${symbol}_${resolution}_${from}_${to}`;
    const cachedData = marketDataCache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    const token = await getAccessToken();
    
    const response = await axios.get(`${API_BASE_URL}/history`, {
      params: {
        symbol,
        resolution,
        from,
        to,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.data || response.data.s !== 'ok') {
      throw new Error('Failed to fetch historical data');
    }
    
    // Format the data for easier consumption
    const formattedData = {
      symbol,
      resolution,
      from,
      to,
      candles: [],
    };
    
    // Create candles from the response
    const { t, o, h, l, c, v } = response.data;
    for (let i = 0; i < t.length; i++) {
      formattedData.candles.push({
        time: t[i],
        open: o[i],
        high: h[i],
        low: l[i],
        close: c[i],
        volume: v[i],
      });
    }
    
    // Cache the result
    marketDataCache.set(cacheKey, formattedData);
    
    return formattedData;
  } catch (error) {
    console.error('Historical data error:', error);
    throw new Error(`Failed to fetch historical data: ${error.message}`);
  }
};

/**
 * Get market depth for a symbol
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Market depth for the requested symbol
 */
export const getMarketDepth = async (symbol) => {
  try {
    const cacheKey = `depth_${symbol}`;
    const cachedData = marketDataCache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    const token = await getAccessToken();
    
    const response = await axios.get(`${API_BASE_URL}/depth`, {
      params: {
        symbol,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.data || response.data.s !== 'ok') {
      throw new Error('Failed to fetch market depth');
    }
    
    // Cache the result
    marketDataCache.set(cacheKey, response.data.d);
    
    return response.data.d;
  } catch (error) {
    console.error('Market depth error:', error);
    throw new Error(`Failed to fetch market depth: ${error.message}`);
  }
};

/**
 * Get available stock symbols with metadata
 * @returns {Array} List of available stocks with symbol, name, and sector
 */
export const getAvailableStocks = () => {
  try {
    const cacheKey = 'available_stocks';
    const cachedData = marketDataCache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // Cache the result for longer period (1 hour) as stock list doesn't change frequently
    marketDataCache.set(cacheKey, AVAILABLE_STOCKS, 3600);
    
    return AVAILABLE_STOCKS;
  } catch (error) {
    console.error('Available stocks error:', error);
    throw new Error(`Failed to fetch available stocks: ${error.message}`);
  }
};