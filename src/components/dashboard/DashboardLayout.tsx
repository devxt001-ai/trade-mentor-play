import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Trophy, Bell, User, Settings } from "lucide-react";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">TradeSim Pro</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-success/10 px-3 py-1 rounded-full">
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">₹9,84,750</span>
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-6">
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
                  <p className="text-2xl font-bold text-foreground">₹9,84,750</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">+₹15,250 (1.58%)</span>
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
                  <p className="text-xs text-muted-foreground mb-2">Day's P&L</p>
                  <div className="flex items-center justify-between">
                    <span className="text-success font-medium">+₹3,420</span>
                    <Badge variant="secondary" className="text-success">+0.35%</Badge>
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
                <Button variant="trading" className="w-full">Buy Stocks</Button>
                <Button variant="outline" className="w-full">Sell Holdings</Button>
                <Button variant="ghost" className="w-full">View Orders</Button>
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
                    <Badge className="w-6 h-6 rounded-full p-0 flex items-center justify-center bg-premium">1</Badge>
                    <span className="text-sm font-medium">TradeMaster</span>
                  </div>
                  <span className="text-sm text-success">+24.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="w-6 h-6 rounded-full p-0 flex items-center justify-center bg-muted">2</Badge>
                    <span className="text-sm font-medium">StockGuru</span>
                  </div>
                  <span className="text-sm text-success">+18.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="w-6 h-6 rounded-full p-0 flex items-center justify-center bg-muted">3</Badge>
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
                    {[
                      { symbol: "RELIANCE", price: "2,847.50", change: "+24.75", percent: "+0.88%", trend: "up" },
                      { symbol: "TCS", price: "3,456.20", change: "-12.30", percent: "-0.35%", trend: "down" },
                      { symbol: "INFY", price: "1,789.40", change: "+45.60", percent: "+2.62%", trend: "up" },
                      { symbol: "HDFCBANK", price: "1,634.80", change: "-8.90", percent: "-0.54%", trend: "down" },
                      { symbol: "ICICIBANK", price: "945.30", change: "+18.70", percent: "+2.02%", trend: "up" }
                    ].map((stock) => (
                      <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                        <div>
                          <p className="font-medium">{stock.symbol}</p>
                          <p className="text-sm text-muted-foreground">₹{stock.price}</p>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center gap-1 ${stock.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                            {stock.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span className="text-sm font-medium">{stock.change}</span>
                          </div>
                          <p className={`text-xs ${stock.trend === 'up' ? 'text-success' : 'text-destructive'}`}>{stock.percent}</p>
                        </div>
                      </div>
                    ))}
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
                    <Button variant="trading" className="bg-success hover:bg-success/90">BUY</Button>
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">SELL</Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Stock Symbol</label>
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
                        <span>Order Value:</span>
                        <span className="font-medium">₹2,84,750</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Available Cash:</span>
                        <span className="text-success">₹2,45,000</span>
                      </div>
                    </div>
                    
                    <Button className="w-full" disabled>Insufficient Funds</Button>
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
                    {[
                      { symbol: "TCS", qty: 50, avgPrice: "3,200.00", current: "3,456.20", pnl: "+₹12,810", percent: "+8.0%" },
                      { symbol: "INFY", qty: 75, avgPrice: "1,650.00", current: "1,789.40", pnl: "+₹10,455", percent: "+8.4%" },
                      { symbol: "HDFCBANK", qty: 40, avgPrice: "1,680.00", current: "1,634.80", pnl: "-₹1,808", percent: "-2.7%" }
                    ].map((holding) => (
                      <div key={holding.symbol} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="font-medium">{holding.symbol}</p>
                          <p className="text-xs text-muted-foreground">{holding.qty} @ ₹{holding.avgPrice}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">₹{holding.current}</p>
                          <p className={`text-xs ${holding.pnl.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                            {holding.pnl} ({holding.percent})
                          </p>
                        </div>
                      </div>
                    ))}
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
                    <div className="text-center p-3 bg-success/10 rounded-lg">
                      <p className="text-2xl font-bold text-success">73%</p>
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">₹8,420</p>
                      <p className="text-xs text-muted-foreground">Avg Profit</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Trades:</span>
                      <span className="font-medium">47</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Best Trade:</span>
                      <span className="font-medium text-success">+₹24,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Worst Trade:</span>
                      <span className="font-medium text-destructive">-₹8,200</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sharpe Ratio:</span>
                      <span className="font-medium">1.34</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" className="w-full">View Detailed Analytics</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};