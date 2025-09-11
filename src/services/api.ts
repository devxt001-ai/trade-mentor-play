import axios from "axios";
import { handleApiError, withErrorHandling } from "../utils/errorHandling";
import {
  quotesCache,
  historicalDataCache,
  ordersCache,
  createCacheKey,
} from "../utils/cacheUtils";

// Define TypeScript interfaces for API responses
export interface StockQuote {
  symbol: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  close?: number;
  volume: number;
  sector?: string;
  success?: boolean;
  message?: string;
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthVerifyResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface StockMetadata {
  symbol: string;
  name: string;
  sector: string;
}

export interface HistoricalData {
  date?: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  candles?: [number, number, number, number, number][];
}

export interface Order {
  orderId?: string;
  id?: string;
  symbol: string;
  qty?: number;
  quantity?: number;
  price?: number;
  tradedPrice?: number;
  limitPrice?: number;
  type?: "BUY" | "SELL" | number;
  side?: number;
  status: "PENDING" | "COMPLETE" | "CANCELLED" | string;
  timestamp?: string;
  orderTimestamp?: number;
  exchangeOrderId?: string;
  productType?: string;
  validity?: string;
  filledQty?: number;
  stopPrice?: number;
  success?: boolean;
  message?: string;
}

export interface OrderDetails {
  symbol: string;
  qty?: number;
  quantity?: number;
  type: number | "BUY" | "SELL";
  side?: number;
  productType?: string;
  limitPrice?: number;
  stopPrice?: number;
  validity?: string;
  disclosedQty?: number;
  offlineOrder?: boolean;
}

// Create an axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add a request interceptor to include session token
api.interceptors.request.use(
  (config) => {
    const sessionToken = localStorage.getItem("supabase_session_token");
    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("supabase_session_token");
      // Redirect to login or show auth error
      console.error("Authentication error. Please login again.");
      
      // If we're not already on the login page, redirect
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Log and format the error
    handleApiError(error);

    return Promise.reject(error);
  }
);

// Define interfaces for auth
export interface LoginCredentials {
  identifier: string; // email or client_id
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  session_token?: string;
  user?: {
    id: string;
    email: string;
    client_id: string;
    created_at: string;
    updated_at: string;
  };
}

export interface FyersAuthResponse {
  success: boolean;
  message?: string;
  auth_url?: string;
  user?: {
    id: string;
    email: string;
    client_id: string;
    created_at: string;
    updated_at: string;
  };
}

// Auth API
export const authAPI = {
  register: withErrorHandling(
    async (credentials: RegisterCredentials): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>("/auth/register", credentials);
      return response.data;
    },
    "Failed to register user"
  ),

  login: withErrorHandling(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    },
    "Failed to login"
  ),

  verifySession: withErrorHandling(async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>("/auth/verify");
    return response.data;
  }, "Failed to verify session"),

  getFyersAuthUrl: withErrorHandling(
    async (): Promise<FyersAuthResponse> => {
      const response = await api.get<FyersAuthResponse>("/auth/fyers-auth-url");
      return response.data;
    },
    "Failed to get Fyers auth URL"
  ),

  completeFyersAuth: withErrorHandling(
    async (authCode: string): Promise<FyersAuthResponse> => {
      const response = await api.post<FyersAuthResponse>("/auth/fyers-token", {
        auth_code: authCode
      });
      return response.data;
    },
    "Failed to complete Fyers authentication"
  ),

  logout: withErrorHandling(async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.warn("Server logout failed, clearing local data anyway", error);
    }
    
    // Clear all caches and local storage
    quotesCache.clear();
    historicalDataCache.clear();
    ordersCache.clear();
    localStorage.removeItem("supabase_session_token");
  }, "Failed to logout"),
};

// Market Data API
export const marketAPI = {
  getMarketData: withErrorHandling(
    async (symbols: string[]): Promise<StockQuote[]> => {
      const response = await api.get("/market/data", {
        params: { symbols: symbols.join(",") },
      });
      return response.data;
    },
    "Failed to fetch market data"
  ),

  getAvailableStocks: withErrorHandling(async (): Promise<StockMetadata[]> => {
    // Check cache first
    const cacheKey = "available_stocks";
    const cachedData = quotesCache.get(cacheKey) as StockMetadata[] | undefined;

    if (cachedData) {
      return cachedData;
    }

    // Fetch fresh data if not in cache
    const response = await api.get<StockMetadata[]>("/market/stocks");

    // Store in cache with TTL of 1 hour
    quotesCache.set(cacheKey, response.data, 60 * 60 * 1000);

    return response.data;
  }, "Failed to fetch available stocks"),

  fetchQuotes: withErrorHandling(
    async (symbols: string[]): Promise<ApiResponse<StockQuote[]>> => {
      // Create cache key
      const cacheKey = createCacheKey("quotes", { symbols: symbols.join(",") });

      // Check cache first
      const cachedData = quotesCache.get(cacheKey) as StockQuote[] | undefined;
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          message: "Quotes retrieved from cache"
        };
      }

      const response = await api.get<StockQuote[]>("/market/quotes", {
        params: { symbols: symbols.join(",") },
      });

      // Store in cache
      quotesCache.set(cacheKey, response.data);

      return {
        success: true,
        data: response.data,
        message: "Quotes fetched successfully"
      };
    },
    "Failed to fetch stock quotes"
  ),

  getHistoricalData: withErrorHandling(
    async (
      symbol: string,
      timeframe: string = "daily",
      from: string = "",
      to: string = ""
    ): Promise<ApiResponse<HistoricalData>> => {
      // Create cache key
      const cacheKey = createCacheKey("historical", {
        symbol,
        timeframe,
        from,
        to,
      });

      // Check cache first
      const cachedData = historicalDataCache.get(cacheKey) as
        | HistoricalData[]
        | undefined;
      if (cachedData) {
        return {
          success: true,
          data: cachedData[0] || {},
          message: "Data retrieved from cache"
        };
      }

      const response = await api.get<HistoricalData[]>("/market/history", {
        params: { symbol, timeframe, from, to },
      });

      // Store in cache with longer TTL for historical data
      historicalDataCache.set(cacheKey, response.data);

      return {
        success: true,
        data: response.data[0] || {},
        message: "Historical data fetched successfully"
      };
    },
    "Failed to fetch historical data"
  ),

  getMarketDepth: withErrorHandling(
    async (
      symbol: string
    ): Promise<ApiResponse<{
      bids: Array<{ price: number; quantity: number }>;
      asks: Array<{ price: number; quantity: number }>;
    }>> => {
      // Create cache key
      const cacheKey = createCacheKey("depth", { symbol });

      // Check cache first
      const cachedData = quotesCache.get(cacheKey) as {
        bids: Array<{ price: number; quantity: number }>;
        asks: Array<{ price: number; quantity: number }>;
      } | undefined;
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          message: "Market depth retrieved from cache"
        };
      }

      const response = await api.get("/market/depth", {
        params: { symbol },
      });

      // Store in cache with short TTL as market depth changes frequently
      quotesCache.set(cacheKey, response.data, 15 * 1000); // 15 seconds TTL

      return {
        success: true,
        data: response.data,
        message: "Market depth fetched successfully"
      };
    },
    "Failed to fetch market depth data"
  ),
};

// Trading API
export const tradingAPI = {
  placeOrder: withErrorHandling(
    async (orderDetails: OrderDetails): Promise<Order> => {
      const response = await api.post<Order>("/trading/orders", orderDetails);

      // Invalidate orders cache when placing a new order
      ordersCache.clear();

      return response.data;
    },
    "Failed to place order"
  ),

  getOrders: withErrorHandling(async (): Promise<Order[]> => {
    // Create cache key
    const cacheKey = createCacheKey("orders");

    // Check cache first
    const cachedData = ordersCache.get(cacheKey) as Order[] | undefined;
    if (cachedData) {
      return cachedData;
    }

    const response = await api.get<Order[]>("/trading/orders");

    // Store in cache
    ordersCache.set(cacheKey, response.data);

    return response.data;
  }, "Failed to fetch orders"),

  getOrderStatus: withErrorHandling(async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/trading/orders/${orderId}`);
    return response.data;
  }, "Failed to fetch order status"),

  modifyOrder: withErrorHandling(
    async (
      orderId: string,
      orderDetails: Partial<OrderDetails>
    ): Promise<Order> => {
      const response = await api.put<Order>(
        `/trading/orders/${orderId}`,
        orderDetails
      );

      // Invalidate orders cache when modifying an order
      ordersCache.clear();

      return response.data;
    },
    "Failed to modify order"
  ),

  cancelOrder: withErrorHandling(async (orderId: string): Promise<Order> => {
    const response = await api.delete<Order>(`/trading/orders/${orderId}`);

    // Invalidate orders cache
    ordersCache.clear();

    return response.data;
  }, "Failed to cancel order"),
};

export default api;
