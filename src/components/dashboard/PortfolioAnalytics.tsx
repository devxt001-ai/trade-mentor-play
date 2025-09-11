import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { TrendingUp, TrendingDown, Activity, PieChart as PieChartIcon, BarChart3, Calendar, Loader2 } from "lucide-react";
import { useMarketData } from "@/hooks/useMarketData";
import { useTrading } from "@/hooks/useTrading";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { StockQuote, HistoricalData, Order } from "@/services/api";


// Define interfaces for portfolio data
interface PortfolioMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

interface PerformanceData {
  date: string;
  value: number;
  previousValue?: number;
}



interface MonthlyReturn {
  month: string;
  returns: number;
}

export const PortfolioAnalytics = () => {
  const { isAuthenticated } = useAuth();
  const { fetchQuotes: getQuotes, getHistoricalData, quotes, isLoading: isMarketDataLoading } = useMarketData();
  const { getOrders, orders, isLoading: isOrdersLoading } = useTrading();
  const { portfolio, holdings, portfolioSummary, loading: isPortfolioLoading, refreshPortfolio } = usePortfolio();
  
  // State for portfolio data
  const [portfolioPerformance, setPortfolioPerformance] = useState<PerformanceData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const isLoading = isMarketDataLoading || isOrdersLoading || isPortfolioLoading || isInitialLoad;

  const [monthlyReturns, setMonthlyReturns] = useState<MonthlyReturn[]>([]);

  const [metrics, setMetrics] = useState<PortfolioMetric[]>([]);
  
  // Define functions before their usage
  const fetchHistoricalData = useCallback(async (): Promise<void> => {
    try {
      // Get historical data for the main portfolio stocks
      const historicalData: HistoricalData = await getHistoricalData('INFY', '1m', 'day');
      
      if (historicalData && historicalData.candles) {
        // Transform historical data for the performance chart
        const transformedData: PerformanceData[] = historicalData.candles.slice(-9).map((candle: [number, number, number, number, number], index: number) => {
          const date = new Date(candle[0]);
          const month = date.toLocaleString('default', { month: 'short' });
          return {
            date: month,
            value: 1000000 * (1 + (index * 0.02)),  // Simulated portfolio value
            previousValue: 1000000 * (1 + (index * 0.015))  // Simulated benchmark value
          };
        });
        
        setPortfolioPerformance(transformedData);
      }
    } catch (error) {
      toast.error('Failed to fetch historical data');
      console.error('Error fetching historical data:', error);
    }
  }, [getHistoricalData]);
  
  const updatePortfolioMetrics = useCallback((): void => {
    if (!quotes || quotes.length === 0) return;
    
    // Portfolio metrics are now handled by the PortfolioContext
    // This function can be used for additional calculations if needed
    
    // Update metrics based on real data
    const newMetrics: PortfolioMetric[] = [...metrics];
    if (quotes.length > 0 && portfolioSummary) {
      // Calculate total return based on portfolio summary
      const totalReturn: string = ((portfolioSummary.totalValue - 1000000) / 1000000 * 100).toFixed(1);
      newMetrics[0].value = `+${totalReturn}%`;
      
      // Update win rate based on orders
      if (orders && orders.length > 0) {
        const successfulOrders: number = orders.filter((order: Order) => 
          order.status === 'COMPLETE' && order.tradedPrice !== undefined && order.limitPrice !== undefined && order.tradedPrice > order.limitPrice
        ).length;
        const winRate: number = Math.round((successfulOrders / orders.length) * 100);
        if (newMetrics[3]) {
          newMetrics[3].value = `${winRate}%`;
        }
      }
    }
    
    setMetrics(newMetrics);
  }, [quotes, orders, metrics, portfolioSummary]);
  
  // Update metrics when portfolio data changes
  useEffect(() => {
    if (portfolioSummary) {
      const totalReturnPercent = portfolioSummary.totalPnLPercent;
      const dayChangePercent = portfolio?.day_change_percent || 0;
      
      setMetrics([
        { 
          label: "Total Return", 
          value: `${totalReturnPercent >= 0 ? '+' : ''}${totalReturnPercent.toFixed(2)}%`, 
          change: `${dayChangePercent >= 0 ? '+' : ''}${dayChangePercent.toFixed(2)}%`, 
          trend: totalReturnPercent >= 0 ? "up" as const : "down" as const, 
          color: totalReturnPercent >= 0 ? "success" : "destructive" 
        },
        { 
          label: "Portfolio Value", 
          value: `₹${portfolioSummary.totalValue.toLocaleString()}`, 
          change: `₹${portfolioSummary.totalPnL.toLocaleString()}`, 
          trend: portfolioSummary.totalPnL >= 0 ? "up" as const : "down" as const, 
          color: "primary" 
        },
        { 
          label: "Available Cash", 
          value: `₹${portfolioSummary.availableCash.toLocaleString()}`, 
          change: "--", 
          trend: "up" as const, 
          color: "success" 
        },
        {
        label: "Holdings Count",
        value: `${portfolioSummary?.holdings?.length || 0}`, 
          change: "--", 
          trend: "up" as const, 
          color: "muted" 
        },
        { 
          label: "Day Change", 
          value: `₹${(portfolio?.day_change || 0).toLocaleString()}`, 
          change: `${dayChangePercent >= 0 ? '+' : ''}${dayChangePercent.toFixed(2)}%`, 
          trend: dayChangePercent >= 0 ? "up" as const : "down" as const, 
          color: dayChangePercent >= 0 ? "success" : "destructive" 
        },
        { 
          label: "Total Invested", 
          value: `₹${(portfolio?.total_invested || 0).toLocaleString()}`, 
          change: "--", 
          trend: "up" as const, 
          color: "premium" 
        },
      ]);
    } else {
      // Fallback to default metrics when no portfolio data
      setMetrics([
        { label: "Total Return", value: "--", change: "--", trend: "up" as const, color: "success" },
        { label: "Portfolio Value", value: "--", change: "--", trend: "up" as const, color: "primary" },
        { label: "Available Cash", value: "--", change: "--", trend: "up" as const, color: "success" },
        { label: "Holdings Count", value: "--", change: "--", trend: "up" as const, color: "muted" },
        { label: "Day Change", value: "--", change: "--", trend: "up" as const, color: "success" },
        { label: "Total Invested", value: "--", change: "--", trend: "up" as const, color: "premium" },
      ]);
    }

    // Initialize monthly returns with sample data (can be enhanced with real historical data)
    setMonthlyReturns([
      { month: "Jan", returns: 2.3 },
      { month: "Feb", returns: 1.8 },
      { month: "Mar", returns: -0.7 },
      { month: "Apr", returns: 3.2 },
      { month: "May", returns: 2.1 },
      { month: "Jun", returns: 1.5 }
    ]);
  }, [portfolioSummary, portfolio]);

  const COLORS = useMemo(() => ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'], []);
  
  // Get portfolio symbols for market data
  const portfolioSymbols = useMemo(() => {
    if (holdings && holdings.length > 0) {
      return holdings.map(holding => holding.stock?.symbol || 'UNKNOWN');
    }
    // Fallback symbols when no holdings
    return ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'];
  }, [holdings]);

  // Generate portfolio allocation data
  const portfolioAllocation = useMemo(() => {
    if (!portfolioSummary || !portfolioSummary.holdings || portfolioSummary.holdings.length === 0) {
      return [];
    }

    const totalValue = portfolioSummary.totalValue;
    
    return portfolioSummary.holdings.map((holding, index) => ({
      name: holding.stock?.symbol || 'UNKNOWN',
      value: Math.round((holding.market_value / totalValue) * 100),
      color: COLORS[index % COLORS.length],
      amount: holding.market_value
    })).sort((a, b) => b.value - a.value); // Sort by allocation percentage
  }, [portfolioSummary, COLORS]);

  // Fetch portfolio data when component mounts
  useEffect(() => {
    const fetchPortfolioData = async (): Promise<void> => {
      if (!isAuthenticated) return;
      
      try {
        setIsInitialLoad(true);
        
        // Get stock symbols from portfolio holdings
        await Promise.all([
          getQuotes(portfolioSymbols),
          fetchHistoricalData()
        ]);
        
        // Generate portfolio performance data
        updatePortfolioMetrics();
      } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
        toast.error('Failed to load portfolio data');
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    fetchPortfolioData();
  }, [isAuthenticated, portfolioSymbols, getQuotes, updatePortfolioMetrics, fetchHistoricalData]);
  
  // Update metrics when quotes or orders change
  useEffect(() => {
    if (quotes && quotes.length > 0 && orders) {
      updatePortfolioMetrics();
    }
  }, [quotes, orders, updatePortfolioMetrics]);

  // Refresh portfolio data
  const handleRefresh = async (): Promise<void> => {
    if (!isAuthenticated) {
      toast.error("Please log in to refresh data");
      return;
    }
    
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      toast.success('Refreshing portfolio data...');
      
      // Get stock symbols from orders
      await getOrders();
      
      // Extract unique symbols from orders
      if (orders && orders.length > 0) {
        const symbols: string[] = [...new Set(orders.map((order: Order) => order.symbol))];
        
        if (symbols.length > 0) {
          await Promise.all([
            getQuotes(symbols),
            fetchHistoricalData(),
            refreshPortfolio()
          ]);
        } else {
          // Fallback to default symbols if no orders found
          await getQuotes(['INFY', 'HDFCBANK', 'RELIANCE', 'TCS', 'SUNPHARMA']);
          await fetchHistoricalData();
          await refreshPortfolio();
        }
      } else {
        // Fallback to default symbols if no orders found
        await getQuotes(['INFY', 'HDFCBANK', 'RELIANCE', 'TCS', 'SUNPHARMA']);
        await fetchHistoricalData();
        await refreshPortfolio();
      }
      
      // Update portfolio metrics
      updatePortfolioMetrics();
      
    } catch (error) {
      console.error("Failed to refresh portfolio data:", error);
      toast.error("Failed to refresh portfolio data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Portfolio Analytics</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRefresh}
            disabled={isMarketDataLoading || isOrdersLoading || isRefreshing}
          >
            {isMarketDataLoading || isOrdersLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Refresh Data'
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric: PortfolioMetric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="text-xl font-bold text-foreground">{metric.value}</p>
                <div className={`flex items-center gap-1 text-xs ${
                  metric.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  {metric.trend === 'up' ? 
                    <TrendingUp className="w-3 h-3" /> : 
                    <TrendingDown className="w-3 h-3" />
                  }
                  <span>{metric.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="returns">Monthly Returns</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Portfolio Performance vs Benchmark
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="Your Portfolio"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="previousValue" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Benchmark"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Sector Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioAllocation}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={(entry: {name: string, value: number}) => `${entry.name}: ${entry.value}%`}
                      >
                        {portfolioAllocation.map((entry, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}%`, 'Allocation']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sector Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioAllocation.map((holding, index: number) => (
                  <div key={holding.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{holding.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{holding.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{holding.value}%</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monthly Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Returns']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="returns" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Value at Risk (95%)</span>
                    <span className="font-medium text-destructive">-₹45,600</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Shortfall</span>
                    <span className="font-medium text-destructive">-₹67,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volatility (Annual)</span>
                    <span className="font-medium">12.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Correlation to Market</span>
                    <span className="font-medium">0.76</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Risk Level</span>
                      <span className="text-sm font-medium">Moderate</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <p className="text-sm text-yellow-600">
                      Your portfolio has moderate risk. Consider diversifying across more sectors.
                    </p>
                  </div>
                  
                  <Badge variant="outline" className="w-fit">
                    Risk Score: 6.2/10
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};