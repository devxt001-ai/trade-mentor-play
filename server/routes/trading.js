import express from 'express';
import { placeOrder, getOrderStatus, getOrders, modifyOrder, cancelOrder } from '../services/tradingService.js';
import { fyersAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route POST /api/trading/order
 * @desc Place a new order
 */
router.post('/order', fyersAuthMiddleware, async (req, res, next) => {
  try {
    const orderDetails = req.body;
    if (!orderDetails || !orderDetails.symbol || !orderDetails.qty || !orderDetails.type) {
      return res.status(400).json({ 
        error: true, 
        message: 'Order details are required (symbol, qty, type)' 
      });
    }
    
    const result = await placeOrder(orderDetails);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/trading/orders
 * @desc Get all orders
 */
router.get('/orders', fyersAuthMiddleware, async (req, res, next) => {
  try {
    const result = await getOrders();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/trading/order/:orderId
 * @desc Get status of a specific order
 */
router.get('/order/:orderId', fyersAuthMiddleware, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ error: true, message: 'Order ID is required' });
    }
    
    const result = await getOrderStatus(orderId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/trading/order/:orderId
 * @desc Modify an existing order
 */
router.put('/order/:orderId', fyersAuthMiddleware, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const orderDetails = req.body;
    if (!orderId || !orderDetails) {
      return res.status(400).json({ 
        error: true, 
        message: 'Order ID and updated details are required' 
      });
    }
    
    const result = await modifyOrder(orderId, orderDetails);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/trading/order/:orderId
 * @desc Cancel an order
 */
router.delete('/order/:orderId', fyersAuthMiddleware, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ error: true, message: 'Order ID is required' });
    }
    
    const result = await cancelOrder(orderId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;