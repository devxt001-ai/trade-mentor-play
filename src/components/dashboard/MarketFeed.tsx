import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Search, Filter, RefreshCw } from "lucide-react";
import { useState } from "react";

export const MarketFeed = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  
  const stocks = [
    { symbol: "RELIANCE", name: "Reliance Industries", price: "2,847.50", change: "+24.75", percent: "+0.88%", volume: "1.2M", trend: "up", sector: "Energy" },
    { symbol: "TCS", name: "Tata Consultancy Services", price: "3,456.20", change: "-12.30", percent: "-0.35%", volume: "890K", trend: "down", sector: "IT" },
    { symbol: "INFY", name: "Infosys Limited", price: "1,789.40", change: "+45.60", percent: "+2.62%", volume: "2.1M", trend: "up", sector: "IT" },
    { symbol: "HDFCBANK", name: "HDFC Bank", price: "1,634.80", change: "-8.90", percent: "-0.54%", volume: "756K", trend: "down", sector: "Banking" },
    { symbol: "ICICIBANK", name: "ICICI Bank", price: "945.30", change: "+18.70", percent: "+2.02%", volume: "1.8M", trend: "up", sector: "Banking" },
    { symbol: "BHARTIARTL", name: "Bharti Airtel", price: "1,234.60", change: "+32.10", percent: "+2.67%", volume: "1.5M", trend: "up", sector: "Telecom" },
    { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: "2,456.90", change: "-15.20", percent: "-0.61%", volume: "432K", trend: "down", sector: "FMCG" },
    { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: "1,876.40", change: "+28.50", percent: "+1.54%", volume: "678K", trend: "up", sector: "Banking" },
  ];

  const marketIndices = [
    { name: "NIFTY 50", value: "19,745.20", change: "+156.30", percent: "+0.80%" },
    { name: "SENSEX", value: "66,023.69", change: "+478.90", percent: "+0.73%" },
    { name: "BANK NIFTY", value: "43,892.15", change: "+201.45", percent: "+0.46%" },
  ];

  return (
    <div className="space-y-6">
      {/* Market Indices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Market Indices
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketIndices.map((index) => (
              <div key={index.name} className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-foreground">{index.name}</h3>
                <p className="text-2xl font-bold text-foreground mt-1">{index.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm text-success font-medium">{index.change} ({index.percent})</span>
                </div>
              </div>
            ))}
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
            {stocks.map((stock) => (
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
                      <Button size="sm" variant="trading" className="text-xs px-2 py-1 h-auto">
                        BUY
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-auto border-destructive text-destructive hover:bg-destructive/10">
                        SELL
                      </Button>
                    </div>
                  </div>
                </div>
                
                {selectedStock === stock.symbol && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Day High</p>
                        <p className="font-medium">₹{(parseFloat(stock.price.replace(',', '')) + 50).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Day Low</p>
                        <p className="font-medium">₹{(parseFloat(stock.price.replace(',', '')) - 30).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">52W High</p>
                        <p className="font-medium">₹{(parseFloat(stock.price.replace(',', '')) + 200).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">52W Low</p>
                        <p className="font-medium">₹{(parseFloat(stock.price.replace(',', '')) - 150).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};