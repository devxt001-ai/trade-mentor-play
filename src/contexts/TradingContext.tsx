import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { tradingAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { ordersCache, createCacheKey } from '../utils/cacheUtils';

interface Order {
  orderId: string;
  symbol: string;
  type: number; // 1: Limit, 2: Market, 3: Stop, 4: StopLimit
  side: number; // 1: Buy, -1: Sell
  status: string;
  qty: number;
  filledQty: number;
  limitPrice?: number;
  stopPrice?: number;
  orderTimestamp: number;
  exchangeOrderId: string;
  productType: string;
  validity: string;
}

interface OrderDetails {
  symbol: string;
  qty: number;
  quantity?: number;
  type: number;
  side: number;
  productType?: string;
  limitPrice?: number;
  stopPrice?: number;
  validity?: string;
  disclosedQty?: number;
  offlineOrder?: boolean;
}

interface TradingContextType {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  placeOrder: (orderDetails: OrderDetails) => Promise<any>;
  getOrders: () => Promise<void>;
  getOrderStatus: (orderId: string) => Promise<any>;
  modifyOrder: (orderId: string, orderDetails: Partial<OrderDetails>) => Promise<any>;
  cancelOrder: (orderId: string) => Promise<any>;
  clearCache: () => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};

interface TradingProviderProps {
  children: ReactNode;
}

export const TradingProvider: React.FC<TradingProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  // Clear orders cache
  const clearCache = useCallback(() => {
    ordersCache.clear();
  }, []);

  // Define getOrders with useCallback BEFORE using it in useEffect
  const getOrders = useCallback(async (): Promise<void> => {
    try {
      if (!isAuthenticated) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      // Check cache first
      const cacheKey = createCacheKey('orders');
      const cachedOrders = ordersCache.get(cacheKey);
      
      if (cachedOrders) {
        setOrders(cachedOrders);
        setIsLoading(false);
        return;
      }
      
      const response = await tradingAPI.getOrders();
      
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
      }
      
      setOrders(response);
      
      // Store in cache
      ordersCache.set(cacheKey, response);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to fetch orders');
      toast.error(`Orders error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch orders on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getOrders();
    }
  }, [isAuthenticated, getOrders]);

  // Clear cache when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      clearCache();
    }
  }, [isAuthenticated, clearCache]);

  const placeOrder = useCallback(async (orderDetails: OrderDetails) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to place orders');
      }
      
      setIsLoading(true);
      setError(null);
      
      const response = await tradingAPI.placeOrder(orderDetails);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to place order');
      }
      
      // Invalidate orders cache
      clearCache();
      
      // Refresh orders list
      await getOrders();
      
      toast.success(`Order placed successfully: ${response.orderId}`);
      return response;
    } catch (error: any) {
      console.error('Error placing order:', error);
      setError(error.message || 'Failed to place order');
      toast.error(`Order error: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, clearCache, getOrders]);

  const getOrderStatus = useCallback(async (orderId: string): Promise<any> => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to check order status');
      }
      
      setIsLoading(true);
      setError(null);
      
      const response = await tradingAPI.getOrderStatus(orderId);
      
      if (!response) {
        throw new Error('Invalid response format');
      }
      
      return response;
    } catch (error: any) {
      console.error('Error fetching order status:', error);
      setError(error.message || 'Failed to fetch order status');
      toast.error(`Order status error: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const modifyOrder = useCallback(async (orderId: string, orderDetails: Partial<OrderDetails>): Promise<any> => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to modify orders');
      }
      
      setIsLoading(true);
      setError(null);
      
      const response = await tradingAPI.modifyOrder(orderId, orderDetails);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to modify order');
      }
      
      // Invalidate orders cache
      clearCache();
      
      // Refresh orders list
      await getOrders();
      
      toast.success('Order modified successfully');
      return response;
    } catch (error: any) {
      console.error('Error modifying order:', error);
      setError(error.message || 'Failed to modify order');
      toast.error(`Order modification error: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, clearCache, getOrders]);

  const cancelOrder = useCallback(async (orderId: string): Promise<any> => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to cancel orders');
      }
      
      setIsLoading(true);
      setError(null);
      
      const response = await tradingAPI.cancelOrder(orderId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel order');
      }
      
      // Invalidate orders cache
      clearCache();
      
      // Refresh orders list
      await getOrders();
      
      toast.success('Order cancelled successfully');
      return response;
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      setError(error.message || 'Failed to cancel order');
      toast.error(`Order cancellation error: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, clearCache, getOrders]);

  const value = {
    orders,
    isLoading,
    error,
    placeOrder,
    getOrders,
    getOrderStatus,
    modifyOrder,
    cancelOrder,
    clearCache,
  };

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
};