import axios from 'axios';
import NodeCache from 'node-cache';


// Cache for order data
const orderCache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL

// Fyers API base URL
const API_BASE_URL = 'https://api.fyers.in/api/v2';

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
 * Place a new order
 * @param {Object} orderDetails - Order details
 * @returns {Promise<Object>} Order placement result
 */
export const placeOrder = async (orderDetails) => {
  try {
    const token = await getAccessToken();
    
    // Format the order payload according to Fyers API requirements
    const orderPayload = {
      symbol: orderDetails.symbol,
      qty: orderDetails.qty,
      type: orderDetails.type, // 1: Limit, 2: Market, 3: Stop, 4: StopLimit
      side: orderDetails.side || 1, // 1: Buy, -1: Sell
      productType: orderDetails.productType || 'CNC', // CNC, INTRADAY, MARGIN
      limitPrice: orderDetails.limitPrice || 0,
      stopPrice: orderDetails.stopPrice || 0,
      validity: orderDetails.validity || 'DAY', // DAY, IOC
      disclosedQty: orderDetails.disclosedQty || 0,
      offlineOrder: orderDetails.offlineOrder || 'False',
    };
    
    const response = await axios.post(`${API_BASE_URL}/orders`, orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.data || response.data.s !== 'ok') {
      throw new Error('Failed to place order');
    }
    
    // Clear the orders cache to ensure fresh data on next fetch
    orderCache.del('orders');
    
    return {
      success: true,
      orderId: response.data.id,
      message: response.data.message || 'Order placed successfully',
    };
  } catch (error) {
    console.error('Order placement error:', error);
    throw new Error(`Failed to place order: ${error.message}`);
  }
};

/**
 * Get all orders
 * @returns {Promise<Object>} List of orders
 */
export const getOrders = async () => {
  try {
    const cachedOrders = orderCache.get('orders');
    if (cachedOrders) {
      return cachedOrders;
    }
    
    const token = await getAccessToken();
    
    const response = await axios.get(`${API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.data || response.data.s !== 'ok') {
      throw new Error('Failed to fetch orders');
    }
    
    // Format the orders for easier consumption
    const formattedOrders = response.data.orderBook.map(order => ({
      orderId: order.id,
      symbol: order.symbol,
      type: order.type,
      side: order.side,
      status: order.status,
      qty: order.qty,
      filledQty: order.filledQty,
      limitPrice: order.limitPrice,
      stopPrice: order.stopPrice,
      orderTimestamp: order.orderTimestamp,
      exchangeOrderId: order.exchangeOrderId,
      productType: order.productType,
      validity: order.validity,
    }));
    
    // Cache the result
    orderCache.set('orders', formattedOrders);
    
    return formattedOrders;
  } catch (error) {
    console.error('Get orders error:', error);
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
};

/**
 * Get status of a specific order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order status
 */
export const getOrderStatus = async (orderId) => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(`${API_BASE_URL}/orders?id=${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.data || response.data.s !== 'ok') {
      throw new Error('Failed to fetch order status');
    }
    
    if (!response.data.orderBook || response.data.orderBook.length === 0) {
      throw new Error('Order not found');
    }
    
    const order = response.data.orderBook[0];
    
    return {
      orderId: order.id,
      symbol: order.symbol,
      type: order.type,
      side: order.side,
      status: order.status,
      qty: order.qty,
      filledQty: order.filledQty,
      limitPrice: order.limitPrice,
      stopPrice: order.stopPrice,
      orderTimestamp: order.orderTimestamp,
      exchangeOrderId: order.exchangeOrderId,
      productType: order.productType,
      validity: order.validity,
    };
  } catch (error) {
    console.error('Get order status error:', error);
    throw new Error(`Failed to fetch order status: ${error.message}`);
  }
};

/**
 * Modify an existing order
 * @param {string} orderId - Order ID
 * @param {Object} orderDetails - Updated order details
 * @returns {Promise<Object>} Order modification result
 */
export const modifyOrder = async (orderId, orderDetails) => {
  try {
    const token = await getAccessToken();
    
    // Format the order payload according to Fyers API requirements
    const orderPayload = {
      id: orderId,
      limitPrice: orderDetails.limitPrice,
      stopPrice: orderDetails.stopPrice,
      qty: orderDetails.qty,
    };
    
    const response = await axios.put(`${API_BASE_URL}/orders`, orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.data || response.data.s !== 'ok') {
      throw new Error('Failed to modify order');
    }
    
    // Clear the orders cache to ensure fresh data on next fetch
    orderCache.del('orders');
    
    return {
      success: true,
      orderId,
      message: response.data.message || 'Order modified successfully',
    };
  } catch (error) {
    console.error('Order modification error:', error);
    throw new Error(`Failed to modify order: ${error.message}`);
  }
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order cancellation result
 */
export const cancelOrder = async (orderId) => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.delete(`${API_BASE_URL}/orders?id=${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.data || response.data.s !== 'ok') {
      throw new Error('Failed to cancel order');
    }
    
    // Clear the orders cache to ensure fresh data on next fetch
    orderCache.del('orders');
    
    return {
      success: true,
      orderId,
      message: response.data.message || 'Order cancelled successfully',
    };
  } catch (error) {
    console.error('Order cancellation error:', error);
    throw new Error(`Failed to cancel order: ${error.message}`);
  }
};