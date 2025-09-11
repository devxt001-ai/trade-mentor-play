import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Trophy,
  Bell,
  User,
  Settings,
  Loader2,
} from "lucide-react";
import { useMarketData } from "@/hooks/useMarketData";
import type { StockQuote } from "@/contexts/MarketDataContext";
import { useTrading } from "@/hooks/useTrading";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export const DashboardLayout = () => {
  const { quotes, isLoading: isMarketLoading, fetchQuotes } = useMarketData();
  const { orders, getOrders, isLoading: isTradingLoading } = useTrading();
  const { isAuthenticated } = useAuth();
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    availableCash: 245000,
  });

  // Fetch market data and orders on component mount
  useEffect(() => {
    if (isAuthenticated) {
      const symbols = [
        "NSE:RELIANCE-EQ",
        "NSE:TCS-EQ",
        "NSE:INFY-EQ",
        "NSE:HDFCBANK-EQ",
        "NSE:ICICIBANK-EQ",
      ];
      fetchQuotes(symbols);
      getOrders();
    }
  }, [isAuthenticated, fetchQuotes, getOrders]);

  // Calculate portfolio metrics from real data
  useEffect(() => {
    if (quotes.length > 0 && orders.length > 0) {
      // Calculate portfolio value from completed orders
      const completedOrders = orders.filter(
        (order) => order.status === "COMPLETE"
      );
      let totalValue = 0;
      let totalPnL = 0;

      completedOrders.forEach((order) => {
        const currentQuote = quotes.find((q) => q.symbol === order.symbol);
        if (currentQuote && order.qty) {
          const currentValue = currentQuote.ltp * order.qty;
          const investedValue =
            (order.tradedPrice || order.price || 0) * order.qty;
          totalValue += currentValue;
          totalPnL += currentValue - investedValue;
        }
      });

      const totalPnLPercent =
        totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0;

      setPortfolioData({
        totalValue,
        totalPnL,
        totalPnLPercent,
        availableCash: 245000 - (totalValue - totalPnL),
      });
    }
  }, [quotes, orders]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format stock data for display
  const formatStockData = (quotes: StockQuote[]) => {
    return quotes.slice(0, 5).map((quote) => ({
      symbol: quote.symbol?.replace("NSE:", "").replace("-EQ", "") || "Unknown",
      price: formatCurrency(quote.ltp || quote.lastPrice || 0),
      change:
        (quote.change || 0) > 0
          ? `+${(quote.change || 0).toFixed(2)}`
          : (quote.change || 0).toFixed(2),
      percent:
        (quote.changePercent || 0) > 0
          ? `+${(quote.changePercent || 0).toFixed(2)}%`
          : `${(quote.changePercent || 0).toFixed(2)}%`,
      trend: (quote.change || 0) >= 0 ? ("up" as const) : ("down" as const),
    }));
  };

  const stockData = formatStockData(quotes);
  return (
    <div className="space-y-6">
      {/* Main Dashboard */}
      <div className="w-full">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Portfolio Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Portfolio Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹9,84,750
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">
                      +₹15,250 (1.58%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Cash</p>
                    <p className="font-semibold">₹2,45,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Invested</p>
                    <p className="font-semibold">₹7,39,750</p>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    Day's P&L
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-success font-medium">+₹3,420</span>
                    <Badge variant="secondary" className="text-success">
                      +0.35%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="trading" className="w-full">
                  Buy Stocks
                </Button>
                <Button variant="outline" className="w-full">
                  Sell Holdings
                </Button>
                <Button variant="ghost" className="w-full">
                  View Orders
                </Button>
              </CardContent>
            </Card>

            {/* Leaderboard Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-premium" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="w-6 h-6 rounded-full p-0 flex items-center justify-center bg-premium">
                      1
                    </Badge>
                    <span className="text-sm font-medium">TradeMaster</span>
                  </div>
                  <span className="text-sm text-success">+24.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="w-6 h-6 rounded-full p-0 flex items-center justify-center bg-muted">
                      2
                    </Badge>
                    <span className="text-sm font-medium">StockGuru</span>
                  </div>
                  <span className="text-sm text-success">+18.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="w-6 h-6 rounded-full p-0 flex items-center justify-center bg-muted">
                      3
                    </Badge>
                    <span className="text-sm font-medium">You</span>
                  </div>
                  <span className="text-sm text-success">+15.8%</span>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Market Overview & Trading Panel will go here */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Market Feed */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Market Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {isMarketLoading ? (
                      // Loading skeleton
                      Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg border border-border"
                          >
                            <div className="flex-1">
                              <div className="h-4 w-20 bg-muted animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                            </div>
                            <div className="text-right">
                              <div className="h-4 w-12 bg-muted animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-10 bg-muted animate-pulse rounded"></div>
                            </div>
                          </div>
                        ))
                    ) : stockData.length > 0 ? (
                      stockData.map((stock) => (
                        <div
                          key={stock.symbol}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div>
                            <p className="font-medium">{stock.symbol}</p>
                            <p className="text-sm text-muted-foreground">
                              {stock.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`flex items-center gap-1 ${
                                stock.trend === "up"
                                  ? "text-success"
                                  : "text-destructive"
                              }`}
                            >
                              {stock.trend === "up" ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              <span className="text-sm font-medium">
                                {stock.change}
                              </span>
                            </div>
                            <p
                              className={`text-xs ${
                                stock.trend === "up"
                                  ? "text-success"
                                  : "text-destructive"
                              }`}
                            >
                              {stock.percent}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No market data available</p>
                        <p className="text-sm">Please check your connection</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Trading Panel */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Quick Trade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="trading"
                      className="bg-success hover:bg-success/90"
                    >
                      BUY
                    </Button>
                    <Button
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10"
                    >
                      SELL
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">
                        Stock Symbol
                      </label>
                      <div className="mt-1 p-2 border border-border rounded-md bg-muted/50">
                        <span className="text-sm">RELIANCE</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Quantity</label>
                        <div className="mt-1 p-2 border border-border rounded-md">
                          <span className="text-sm">100</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Price</label>
                        <div className="mt-1 p-2 border border-border rounded-md">
                          <span className="text-sm">₹2,847.50</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span>Portfolio Value:</span>
                        <span className="font-medium">
                          {formatCurrency(portfolioData.totalValue)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Available Cash:</span>
                        <span className="text-success">
                          {formatCurrency(portfolioData.availableCash)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total P&L:</span>
                        <span
                          className={
                            portfolioData.totalPnL >= 0
                              ? "text-success"
                              : "text-destructive"
                          }
                        >
                          {portfolioData.totalPnL >= 0 ? "+" : ""}
                          {formatCurrency(portfolioData.totalPnL)}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full" disabled>
                      Insufficient Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Holdings & Analytics Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Holdings */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {isTradingLoading ? (
                      // Loading skeleton for holdings
                      Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg border border-border"
                          >
                            <div className="flex-1">
                              <div className="h-4 w-16 bg-muted animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                            </div>
                            <div className="text-right">
                              <div className="h-4 w-16 bg-muted animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
                            </div>
                          </div>
                        ))
                    ) : orders.filter(
                        (order) =>
                          order.status === "COMPLETE" && order.type === "BUY"
                      ).length > 0 ? (
                      orders
                        .filter(
                          (order) =>
                            order.status === "COMPLETE" && order.type === "BUY"
                        )
                        .slice(0, 3)
                        .map((holding) => {
                          const currentQuote = quotes.find(
                            (q) => q.symbol === holding.symbol
                          );
                          const currentPrice = currentQuote?.ltp || 0;
                          const avgPrice =
                            holding.tradedPrice || holding.price || 0;
                          const qty = holding.qty || holding.quantity || 0;
                          const currentValue = currentPrice * qty;
                          const investedValue = avgPrice * qty;
                          const pnl = currentValue - investedValue;
                          const pnlPercent =
                            investedValue > 0 ? (pnl / investedValue) * 100 : 0;

                          return (
                            <div
                              key={holding.symbol || holding.orderId}
                              className="flex items-center justify-between p-3 rounded-lg border border-border"
                            >
                              <div>
                                <p className="font-medium">
                                  {holding.symbol
                                    ?.replace("NSE:", "")
                                    .replace("-EQ", "") || "Unknown"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {qty} @ {formatCurrency(avgPrice)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {formatCurrency(currentPrice)}
                                </p>
                                <p
                                  className={`text-xs ${
                                    pnl >= 0
                                      ? "text-success"
                                      : "text-destructive"
                                  }`}
                                >
                                  {pnl >= 0 ? "+" : ""}
                                  {formatCurrency(pnl)} (
                                  {pnlPercent >= 0 ? "+" : ""}
                                  {pnlPercent.toFixed(1)}%)
                                </p>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No holdings found</p>
                        <p className="text-sm">
                          Start trading to see your portfolio
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`text-center p-3 rounded-lg ${
                        portfolioData.totalPnLPercent >= 0
                          ? "bg-success/10 border border-success/20"
                          : "bg-destructive/10 border border-destructive/20"
                      }`}
                    >
                      <p
                        className={`text-2xl font-bold ${
                          portfolioData.totalPnLPercent >= 0
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {portfolioData.totalPnLPercent >= 0 ? "+" : ""}
                        {portfolioData.totalPnLPercent.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Return
                      </p>
                    </div>
                    <div
                      className={`text-center p-3 rounded-lg ${
                        portfolioData.totalPnL >= 0
                          ? "bg-success/10 border border-success/20"
                          : "bg-destructive/10 border border-destructive/20"
                      }`}
                    >
                      <p
                        className={`text-2xl font-bold ${
                          portfolioData.totalPnL >= 0
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {portfolioData.totalPnL >= 0 ? "+" : ""}
                        {formatCurrency(portfolioData.totalPnL)}
                      </p>
                      <p className="text-xs text-muted-foreground">Total P&L</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Trades:</span>
                      <span className="font-medium">
                        {
                          orders.filter((order) => order.status === "COMPLETE")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Portfolio Value:</span>
                      <span className="font-medium">
                        {formatCurrency(portfolioData.totalValue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Available Cash:</span>
                      <span className="font-medium text-success">
                        {formatCurrency(portfolioData.availableCash)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Active Positions:</span>
                      <span className="font-medium">
                        {
                          orders.filter(
                            (order) =>
                              order.status === "COMPLETE" &&
                              order.type === "BUY"
                          ).length
                        }
                      </span>
                    </div>
                  </div>

                  <Button variant="ghost" className="w-full">
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
