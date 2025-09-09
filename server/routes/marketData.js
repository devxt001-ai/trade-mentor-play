import express from 'express';
import { getMarketData, getQuotes, getHistoricalData, getMarketDepth, getAvailableStocks } from '../services/marketDataService.js';

const router = express.Router();

/**
 * @route GET /api/market/data
 * @desc Get market data for multiple symbols
 */
router.get('/data', async (req, res, next) => {
  try {
    const { symbols } = req.query;
    if (!symbols) {
      return res.status(400).json({ error: true, message: 'Symbols parameter is required' });
    }
    
    const symbolsArray = symbols.split(',');
    const result = await getMarketData(symbolsArray);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/market/quotes
 * @desc Get detailed quotes for specific symbols
 */
router.get('/quotes', async (req, res, next) => {
  try {
    const { symbols } = req.query;
    if (!symbols) {
      return res.status(400).json({ error: true, message: 'Symbols parameter is required' });
    }
    
    const symbolsArray = symbols.split(',');
    const result = await getQuotes(symbolsArray);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/market/history
 * @desc Get historical data for a symbol
 */
router.get('/history', async (req, res, next) => {
  try {
    const { symbol, resolution, from, to } = req.query;
    if (!symbol || !resolution || !from || !to) {
      return res.status(400).json({ 
        error: true, 
        message: 'Symbol, resolution, from and to parameters are required' 
      });
    }
    
    const result = await getHistoricalData(symbol, resolution, from, to);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/market/depth
 * @desc Get market depth for a symbol
 */
router.get('/depth', async (req, res, next) => {
  try {
    const { symbol } = req.query;
    if (!symbol) {
      return res.status(400).json({ error: true, message: 'Symbol parameter is required' });
    }
    
    const result = await getMarketDepth(symbol);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/market/stocks
 * @desc Get list of available stocks with metadata
 */
router.get('/stocks', async (req, res, next) => {
  try {
    const result = await getAvailableStocks();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;