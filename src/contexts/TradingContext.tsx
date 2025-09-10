import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { tradingAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { ordersCache, createCacheKey } from "../utils/cacheUtils";
import { Order, OrderDetails } from "../services/api";

interface TradingContextType {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  placeOrder: (orderDetails: OrderDetails) => Promise<Order>;
  getOrders: () => Promise<void>;
  getOrderStatus: (orderId: string) => Promise<Order>;
  modifyOrder: (
    orderId: string,
    orderDetails: Partial<OrderDetails>
  ) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<Order>;
  clearCache: () => void;
  
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

// Export the context for use in hooks
export { TradingContext };

// useTradingContext hook
export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
};

// Hook moved to separate file to fix Fast Refresh warnings

interface TradingProviderProps {
  children: ReactNode;
}

export const TradingProvider: React.FC<TradingProviderProps> = ({
  children,
}) => {
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
      const cacheKey = createCacheKey("orders");
      const cachedOrders = ordersCache.get(cacheKey) as Order[] | undefined;

      if (cachedOrders && Array.isArray(cachedOrders)) {
        setOrders(cachedOrders);
        setIsLoading(false);
        return;
      }

      const response = await tradingAPI.getOrders();

      if (!Array.isArray(response)) {
        throw new Error("Invalid response format");
      }

      setOrders(response);

      // Store in cache
      ordersCache.set(cacheKey, response);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders";
      console.error("Error fetching orders:", error);
      setError(errorMessage);
      toast.error(`Orders error: ${errorMessage}`);
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

  const placeOrder = useCallback(
    async (orderDetails: OrderDetails) => {
      try {
        if (!isAuthenticated) {
          throw new Error("You must be logged in to place orders");
        }

        setIsLoading(true);
        setError(null);

        const response = await tradingAPI.placeOrder(orderDetails);

        if (!response.success) {
          throw new Error(response.message || "Failed to place order");
        }

        // Invalidate orders cache
        clearCache();

        // Refresh orders list
        await getOrders();

        toast.success(`Order placed successfully: ${response.orderId}`);
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to place order";
        console.error("Error placing order:", error);
        setError(errorMessage);
        toast.error(`Order error: ${errorMessage}`);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearCache, getOrders]
  );

  const getOrderStatus = useCallback(
    async (orderId: string): Promise<Order> => {
      try {
        if (!isAuthenticated) {
          throw new Error("You must be logged in to check order status");
        }

        setIsLoading(true);
        setError(null);

        const response = await tradingAPI.getOrderStatus(orderId);

        if (!response) {
          throw new Error("Invalid response format");
        }

        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch order status";
        console.error("Error fetching order status:", error);
        setError(errorMessage);
        toast.error(`Order status error: ${errorMessage}`);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const modifyOrder = useCallback(
    async (
      orderId: string,
      orderDetails: Partial<OrderDetails>
    ): Promise<Order> => {
      try {
        if (!isAuthenticated) {
          throw new Error("You must be logged in to modify orders");
        }

        setIsLoading(true);
        setError(null);

        const response = await tradingAPI.modifyOrder(orderId, orderDetails);

        if (!response.success) {
          throw new Error(response.message || "Failed to modify order");
        }

        // Invalidate orders cache
        clearCache();

        // Refresh orders list
        await getOrders();

        toast.success("Order modified successfully");
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to modify order";
        console.error("Error modifying order:", error);
        setError(errorMessage);
        toast.error(`Order modification error: ${errorMessage}`);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearCache, getOrders]
  );

  const cancelOrder = useCallback(
    async (orderId: string): Promise<Order> => {
      try {
        if (!isAuthenticated) {
          throw new Error("You must be logged in to cancel orders");
        }

        setIsLoading(true);
        setError(null);

        const response = await tradingAPI.cancelOrder(orderId);

        if (!response.success) {
          throw new Error(response.message || "Failed to cancel order");
        }

        // Invalidate orders cache
        clearCache();

        // Refresh orders list
        await getOrders();

        toast.success("Order cancelled successfully");
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to cancel order";
        console.error("Error cancelling order:", error);
        setError(errorMessage);
        toast.error(`Order cancellation error: ${errorMessage}`);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, clearCache, getOrders]
  );

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

  return (
    <TradingContext.Provider value={value}>{children}</TradingContext.Provider>
  );
};
