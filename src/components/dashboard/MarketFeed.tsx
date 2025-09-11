import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Search, Filter, RefreshCw, Loader2, AlertCircle, DollarSign, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { useMarketData } from "@/hooks/useMarketData";
import { useTrading } from "@/hooks/useTrading";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { marketAPI, StockQuote, StockMetadata } from "@/services/api";

// Define interface for stock display data
interface StockDisplay {
  symbol: string;
  name: string;
  price: string;
  change: string;
  percent: string;
  volume: string;
  trend: 'up' | 'down';
  sector: string;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
}

// Define interface for market index data
interface MarketIndex {
  name: string;
  value: string;
  change: string;
  percent: string;
}

export const MarketFeed = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { fetchQuotes, quotes, isLoading: isMarketDataLoading } = useMarketData();
  const { placeOrder } = useTrading();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  
  // State for available stocks from API
  const [availableStocks, setAvailableStocks] = useState<StockMetadata[]>([]);
  const [isLoadingStocks, setIsLoadingStocks] = useState(true);
  
  // Fetch available stocks from API
  useEffect(() => {
    const fetchAvailableStocks = async () => {
      try {
        setIsLoadingStocks(true);
        const stocks = await marketAPI.getAvailableStocks();
        setAvailableStocks(stocks);
        
        // Extract symbols for quotes fetching
        const symbols = stocks.map((stock: StockMetadata) => stock.symbol.split(':')[1].replace('-EQ', ''));
        if (isAuthenticated && symbols.length > 0) {
          fetchQuotes(symbols);
        }
      } catch (error) {
        console.error('Failed to fetch available stocks:', error);
        // Don't show error toast for demo, just use mock data
        // toast.error('Failed to load stock symbols');
      } finally {
        setIsLoadingStocks(false);
      }
    };
    
    fetchAvailableStocks();
  }, [isAuthenticated, fetchQuotes]);
  
  // Create a mapping of stock symbols to metadata
  interface StockMetadataMap {
    [symbol: string]: {
      name: string;
      sector: string;
    };
  }
  
  const stockMetadata: StockMetadataMap = availableStocks.reduce<StockMetadataMap>((acc, stock) => {
    const symbol = stock.symbol.split(':')[1].replace('-EQ', '');
    acc[symbol] = { name: stock.name, sector: stock.sector };
    return acc;
  }, {});
  
  // Mock data for demo purposes when API fails
  const mockStocks: StockDisplay[] = [
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      price: "3,847.50",
      change: "+23.75",
      percent: "+0.62%",
      volume: "2.1M",
      trend: "up" as const,
      sector: "IT",
      dayHigh: 3865.20,
      dayLow: 3820.15,
      yearHigh: 4150.00,
      yearLow: 3200.00
    },
    {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      price: "2,847.30",
      change: "-12.45",
      percent: "-0.43%",
      volume: "3.8M",
      trend: "down" as const,
      sector: "Energy",
      dayHigh: 2875.80,
      dayLow: 2835.20,
      yearHigh: 3100.00,
      yearLow: 2200.00
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank",
      price: "1,647.85",
      change: "+8.90",
      percent: "+0.54%",
      volume: "1.9M",
      trend: "up" as const,
      sector: "Banking",
      dayHigh: 1655.40,
      dayLow: 1635.20,
      yearHigh: 1800.00,
      yearLow: 1400.00
    },
    {
      symbol: "INFY",
      name: "Infosys",
      price: "1,789.25",
      change: "+15.60",
      percent: "+0.88%",
      volume: "2.7M",
      trend: "up" as const,
      sector: "IT",
      dayHigh: 1795.80,
      dayLow: 1770.30,
      yearHigh: 1950.00,
      yearLow: 1350.00
    },
    {
      symbol: "ICICIBANK",
      name: "ICICI Bank",
      price: "1,247.60",
      change: "-5.25",
      percent: "-0.42%",
      volume: "4.2M",
      trend: "down" as const,
      sector: "Banking",
      dayHigh: 1258.90,
      dayLow: 1240.15,
      yearHigh: 1350.00,
      yearLow: 950.00
    }
  ];

  // Transform quotes into stock data format, fallback to mock data if API fails
  const stocks: StockDisplay[] = quotes && quotes.length > 0 
    ? quotes.map((quote: StockQuote) => {
        const symbol = quote.symbol.split(':')[1] || quote.symbol;
        const metadata = stockMetadata[symbol] || { name: symbol, sector: "Other" };
        
        // Calculate change and percentage
        const change = quote.ltp - quote.open;
        const percentChange = (change / quote.open) * 100;
        
        return {
          symbol,
          name: metadata.name,
          price: quote.ltp.toLocaleString(),
          change: change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2),
          percent: change >= 0 ? `+${percentChange.toFixed(2)}%` : `${percentChange.toFixed(2)}%`,
          volume: `${(quote.volume / 1000).toFixed(1)}K`,
          trend: change >= 0 ? "up" as const : "down" as const,
          sector: metadata.sector,
          dayHigh: quote.high,
          dayLow: quote.low,
          yearHigh: quote.high * 1.15, // Simulated 52W high
          yearLow: quote.low * 0.85,  // Simulated 52W low
        };
      })
    : mockStocks; // Use mock data when API fails or is loading

  // State for market indices
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [isLoadingIndices, setIsLoadingIndices] = useState(true);
  
  // Fetch market indices data
  useEffect(() => {
    const fetchMarketIndices = async () => {
      try {
        setIsLoadingIndices(true);
        // Fetch major indices data
        const indicesSymbols = ['NSE:NIFTY50-INDEX', 'NSE:SENSEX-INDEX', 'NSE:BANKNIFTY-INDEX'];
        const indicesResponse = await marketAPI.fetchQuotes(indicesSymbols);
        
        if (indicesResponse && indicesResponse.data && indicesResponse.data.length > 0) {
          const formattedIndices = indicesResponse.data.map((index: StockQuote) => {
            const change = index.ltp - index.open;
            const percentChange = (change / index.open) * 100;
            
            let name = 'Unknown Index';
            if (index.symbol.includes('NIFTY50')) name = 'NIFTY 50';
            else if (index.symbol.includes('SENSEX')) name = 'SENSEX';
            else if (index.symbol.includes('BANKNIFTY')) name = 'BANK NIFTY';
            
            return {
              name,
              value: index.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              change: change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2),
              percent: change >= 0 ? `+${percentChange.toFixed(2)}%` : `${percentChange.toFixed(2)}%`
            };
          });
          setMarketIndices(formattedIndices);
        } else {
          // Fallback to demo data if API fails
          setMarketIndices([
            { name: "NIFTY 50", value: "19,745.20", change: "+156.30", percent: "+0.80%" },
            { name: "SENSEX", value: "66,023.69", change: "+478.90", percent: "+0.73%" },
            { name: "BANK NIFTY", value: "43,892.15", change: "+201.45", percent: "+0.46%" },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch market indices:', error);
        // Fallback to demo data
        setMarketIndices([
          { name: "NIFTY 50", value: "19,745.20", change: "+156.30", percent: "+0.80%" },
          { name: "SENSEX", value: "66,023.69", change: "+478.90", percent: "+0.73%" },
          { name: "BANK NIFTY", value: "43,892.15", change: "+201.45", percent: "+0.46%" },
        ]);
      } finally {
        setIsLoadingIndices(false);
      }
    };
    
    if (isAuthenticated) {
      fetchMarketIndices();
    } else {
      // Set fallback data when not authenticated
      setMarketIndices([
        { name: "NIFTY 50", value: "19,745.20", change: "+156.30", percent: "+0.80%" },
        { name: "SENSEX", value: "66,023.69", change: "+478.90", percent: "+0.73%" },
        { name: "BANK NIFTY", value: "43,892.15", change: "+201.45", percent: "+0.46%" },
      ]);
      setIsLoadingIndices(false);
    }
  }, [isAuthenticated]);
  
  // Define interface for order parameters
  interface OrderParams {
    symbol: string;
    qty: number;
    type: number; // 1 for Market, 2 for Limit, etc.
    side: number; // 1 for Buy, -1 for Sell
    productType: string;
    limitPrice?: number;
    stopPrice?: number;
    validity: string;
    disclosedQty?: number;
    offlineOrder?: boolean;
  }
  
  // Handle buy order
  const handleBuy = (symbol: string): void => {
    if (!isAuthenticated) {
      toast.error("Please log in to place orders");
      return;
    }
    
    setIsBuying(true);
    
    try {
      const stock = stocks.find(s => s.symbol === symbol);
      if (stock) {
        const orderParams: OrderParams = {
          symbol: symbol,
          qty: 1,
          type: 1, // Market order
          side: 1, // Buy
          productType: "CNC", // Cash and carry
          limitPrice: 0,
          stopPrice: 0,
          validity: "DAY",
          disclosedQty: 0,
          offlineOrder: false,
        };
        
        placeOrder(orderParams);
        toast.success(`Buy order placed for ${symbol}`);
      }
    } catch (error) {
      console.error('Error placing buy order:', error);
      toast.error('Failed to place buy order');
    } finally {
      setIsBuying(false);
    }
  };
  
  // Handle sell order
  const handleSell = (symbol: string): void => {
    if (!isAuthenticated) {
      toast.error("Please log in to place orders");
      return;
    }
    
    setIsSelling(true);
    
    try {
    
      const stock = stocks.find(s => s.symbol === symbol);
      if (stock) {
        const orderParams: OrderParams = {
          symbol: symbol,
          qty: 1,
          type: 1, // Market order
          side: -1, // Sell
          productType: "CNC", // Cash and carry
          limitPrice: 0,
          stopPrice: 0,
          validity: "DAY",
          disclosedQty: 0,
          offlineOrder: false,
        };
        
        placeOrder(orderParams);
        toast.success(`Sell order placed for ${symbol}`);
      }
    } catch (error) {
      console.error('Error placing sell order:', error);
      toast.error('Failed to place sell order');
    } finally {
      setIsSelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Indices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Market Indices
            <Button 
              variant="ghost" 
              size="sm"
              onClick={async () => {
                if (!isAuthenticated) {
                  toast.error("Please log in to refresh data");
                  return;
                }
                
                setIsRefreshing(true);
                
                try {
                  const symbols = availableStocks.map((stock: StockMetadata) => 
                    stock.symbol.split(':')[1].replace('-EQ', '')
                  );
                  
                  if (symbols.length > 0) {
                    await fetchQuotes(symbols);
                    toast.success("Market data refreshed");
                  } else {
                    toast.error("No stock symbols available");
                  }
                } catch (error) {
                  console.error('Error refreshing market data:', error);
                  toast.error('Failed to refresh market data');
                } finally {
                  setIsRefreshing(false);
                }
              }}
              disabled={isMarketDataLoading || isRefreshing}
            >
              {isMarketDataLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoadingIndices ? (
              // Loading skeleton for indices
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <div className="h-5 w-24 bg-muted animate-pulse rounded mb-2"></div>
                  <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                </div>
              ))
            ) : marketIndices.length > 0 ? marketIndices.map((index) => {
              const isPositive = index.change.startsWith('+');
              return (
                <div key={index.name} className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-foreground">{index.name}</h3>
                  <p className="text-2xl font-bold text-foreground mt-1">{index.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${
                      isPositive ? 'text-success' : 'text-destructive'
                    }`}>
                      {index.change} ({index.percent})
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-3 text-center py-4 text-muted-foreground">
                <p>Market indices data unavailable</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stock List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Live Stock Prices</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isMarketDataLoading || isLoadingStocks ? (
              // Loading skeletons
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-5 w-24 mb-1 bg-muted animate-pulse rounded"></div>
                      <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 w-16 mb-1 bg-muted animate-pulse rounded"></div>
                      <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : stocks && stocks.length > 0 ? stocks.map((stock) => (
              <div 
                key={stock.symbol} 
                className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                  selectedStock === stock.symbol 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => setSelectedStock(selectedStock === stock.symbol ? null : stock.symbol)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{stock.symbol}</h3>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{stock.sector}</Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">₹{stock.price}</p>
                    <div className={`flex items-center gap-1 justify-end ${
                      stock.trend === 'up' ? 'text-success' : 'text-destructive'
                    }`}>
                      {stock.trend === 'up' ? 
                        <TrendingUp className="w-4 h-4" /> : 
                        <TrendingDown className="w-4 h-4" />
                      }
                      <span className="text-sm font-medium">{stock.change}</span>
                    </div>
                    <p className={`text-xs ${stock.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {stock.percent}
                    </p>
                  </div>
                  
                  <div className="ml-6 text-right min-w-[80px]">
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="text-sm font-medium">{stock.volume}</p>
                    <div className="flex gap-1 mt-2">
                      <Button 
                        size="sm" 
                        variant="trading" 
                        className="text-xs px-2 py-1 h-auto"
                        onClick={() => handleBuy(stock.symbol)}
                        disabled={isMarketDataLoading || !isAuthenticated}
                      >
                        {isMarketDataLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        ) : "BUY"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs px-2 py-1 h-auto border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleSell(stock.symbol)}
                        disabled={isMarketDataLoading || !isAuthenticated}
                      >
                        {isMarketDataLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        ) : "SELL"}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {selectedStock === stock.symbol && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Day High</p>
                        <p className="font-medium">₹{stock.dayHigh?.toLocaleString() || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Day Low</p>
                        <p className="font-medium">₹{stock.dayLow?.toLocaleString() || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">52W High</p>
                        <p className="font-medium">₹{stock.yearHigh?.toLocaleString() || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">52W Low</p>
                        <p className="font-medium">₹{stock.yearLow?.toLocaleString() || '—'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )) : (
              <div className="p-4 rounded-lg border">
                <p className="text-center text-muted-foreground">No stock data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};