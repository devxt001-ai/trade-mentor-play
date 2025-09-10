import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  marketAPI,
  StockQuote as ApiStockQuote,
  HistoricalData,
  ApiResponse,
} from "../services/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import {
  quotesCache,
  historicalDataCache,
  createCacheKey,
} from "../utils/cacheUtils";

export interface StockQuote {
  symbol: string;
  ltp: number; // Last traded price
  lastPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  timestamp: number;
}

interface ApiQuoteResponse {
  symbol: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  timestamp: number;
}

interface MarketDepthData {
  bids: Array<{ price: number; quantity: number }>;
  asks: Array<{ price: number; quantity: number }>;
}

interface MarketDataContextType {
  quotes: StockQuote[];
  isLoading: boolean;
  error: string | null;
  fetchQuotes: (symbols: string[]) => Promise<void>;
  getHistoricalData: (
    symbol: string,
    timeframe: string,
    from: string,
    to?: string
  ) => Promise<HistoricalData>;
  getMarketDepth: (symbol: string) => Promise<MarketDepthData>;
  clearCache: () => void;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(
  undefined
);

// Export the context for use in hooks
export { MarketDataContext };

// useMarketData hook
export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error("useMarketData must be used within a MarketDataProvider");
  }
  return context;
};

// Hook moved to separate file to fix Fast Refresh warnings

interface MarketDataProviderProps {
  children: ReactNode;
}

// Default symbols to track
const DEFAULT_SYMBOLS = ["NSE:TCS-EQ", "NSE:INFY-EQ", "NSE:HDFCBANK-EQ"];

export const MarketDataProvider: React.FC<MarketDataProviderProps> = ({
  children,
}) => {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Clear all market data caches
  const clearCache = useCallback(() => {
    quotesCache.clear();
    historicalDataCache.clear();
  }, []);

  // Define fetchQuotes with useCallback BEFORE using it in useEffect
  const fetchQuotes = useCallback(async (symbols: string[]): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = createCacheKey("quotes", { symbols: symbols.join(",") });
      const cachedData = quotesCache.get(cacheKey) as StockQuote[] | undefined;

      if (cachedData) {
        setQuotes(cachedData);
        setIsLoading(false);
        return;
      }

      const response = await marketAPI.fetchQuotes(symbols);

      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch quotes");
      }

      // Format and store quotes
      const formattedQuotes: StockQuote[] = response.data.map(
        (quote: ApiStockQuote) => ({
          symbol: quote.symbol,
          ltp: quote.ltp || 0,
          lastPrice: quote.ltp || 0,
          change: 0, // Calculate from open/ltp if needed
          changePercent: 0, // Calculate from open/ltp if needed
          high: quote.high,
          low: quote.low,
          open: quote.open,
          close: quote.close || quote.ltp,
          volume: quote.volume,
          timestamp: Date.now(),
        })
      );

      // Store in cache
      quotesCache.set(cacheKey, formattedQuotes);
      setQuotes(formattedQuotes);
    } catch (error: unknown) {
      console.error("Error fetching quotes:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch market data";
      setError(errorMessage);
      toast.error(`Market data error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any props or state

  // Fetch quotes for default symbols when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchQuotes(DEFAULT_SYMBOLS);

      // Set up polling for real-time updates (every 30 seconds)
      const intervalId = setInterval(() => {
        // Force refresh from API by removing from cache
        const cacheKey = createCacheKey("quotes", {
          symbols: DEFAULT_SYMBOLS.join(","),
        });
        quotesCache.remove(cacheKey);
        fetchQuotes(DEFAULT_SYMBOLS);
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, fetchQuotes]);

  // Clear cache when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      clearCache();
    }
  }, [isAuthenticated, clearCache]);

  const getHistoricalData = useCallback(
    async (symbol: string, timeframe: string, from: string, to?: string) => {
      try {
        setIsLoading(true);

        // Check cache first
        const cacheKey = createCacheKey('historical', {
          symbol,
          timeframe,
          from,
          to,
        });
        const cachedData = historicalDataCache.get(cacheKey) as HistoricalData | undefined;

        if (cachedData) {
          setIsLoading(false);
          return cachedData;
        }

        const response = await marketAPI.getHistoricalData(
          symbol,
          timeframe,
          from,
          to
        );

        if (!response || !response.success) {
          throw new Error(
            response?.message || "Failed to fetch historical data"
          );
        }

        // Store in cache
        historicalDataCache.set(cacheKey, response.data);
        return response.data;
      } catch (error: unknown) {
        console.error("Error fetching historical data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch historical data";
        toast.error(`Historical data error: ${errorMessage}`);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getMarketDepth = useCallback(async (symbol: string) => {
    try {
      setIsLoading(true);

      const response = await marketAPI.getMarketDepth(symbol);

      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch market depth");
      }

      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching market depth:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch market depth";
      toast.error(`Market depth error: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    quotes,
    isLoading,
    error,
    fetchQuotes,
    getHistoricalData,
    getMarketDepth,
    clearCache,
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
};
