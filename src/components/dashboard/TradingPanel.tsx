import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, DollarSign, TrendingUp, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useMarketData } from "@/contexts/MarketDataContext";
import { useTrading } from "@/contexts/TradingContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const TradingPanel = () => {
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [selectedStock, setSelectedStock] = useState("NSE:RELIANCE-EQ");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get market data and trading functionality from contexts
  const { quotes, isLoading: isLoadingMarketData, fetchQuotes } = useMarketData();
  const { placeOrder, orders, getOrders, isLoading: isLoadingOrders } = useTrading();
  const { isAuthenticated } = useAuth();
  
  // Hardcoded available funds for now (would come from API in production)
  const availableFunds = 245000;
  
  // Get current price from quotes
  const currentPrice = quotes[selectedStock]?.lastPrice || 0;
  
  // Fetch quotes for default symbols when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      const symbols = ["NSE:RELIANCE-EQ", "NSE:TCS-EQ", "NSE:INFY-EQ", "NSE:HDFCBANK-EQ", "NSE:ICICIBANK-EQ"];
      fetchQuotes(symbols);
      getOrders();
    }
  }, [isAuthenticated, fetchQuotes, getOrders]);
  
  const calculateOrderValue = () => {
    const qty = parseInt(quantity) || 0;
    const orderPrice = orderType === "market" ? currentPrice : (parseFloat(price) || 0);
    return qty * orderPrice;
  };

  const orderValue = calculateOrderValue();
  const canAfford = orderValue <= availableFunds;
  
  // Handle order placement
  const handlePlaceOrder = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please log in to place orders");
        return;
      }
      
      setIsSubmitting(true);
      
      // Format order details for API
      const orderDetails = {
        symbol: selectedStock,
        qty: parseInt(quantity),
        type: orderType === "market" ? 2 : orderType === "limit" ? 1 : orderType === "stop" ? 3 : 4, // 1: Limit, 2: Market, 3: Stop, 4: StopLimit
        side: 1, // 1: Buy, -1: Sell
        productType: "CNC", // CNC, INTRADAY, MARGIN
        limitPrice: orderType !== "market" ? parseFloat(price) : 0,
        stopPrice: orderType === "stop" || orderType === "stop-limit" ? parseFloat(price) : 0,
        validity: "DAY",
      };
      
      const response = await placeOrder(orderDetails);
      
      if (response.success) {
        toast.success(`Order placed successfully: ${response.orderId}`);
        // Reset form
        setQuantity("");
        setPrice("");
      }
    } catch (error: any) {
      toast.error(`Failed to place order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle sell order
  const handleSellOrder = async (symbol: string, qty: number) => {
    try {
      if (!isAuthenticated) {
        toast.error("Please log in to place orders");
        return;
      }
      
      setIsSubmitting(true);
      
      // Format order details for API
      const orderDetails = {
        symbol,
        qty,
        type: 2, // Market order
        side: -1, // Sell
        productType: "CNC",
        validity: "DAY",
      };
      
      const response = await placeOrder(orderDetails);
      
      if (response.success) {
        toast.success(`Sell order placed successfully: ${response.orderId}`);
      }
    } catch (error: any) {
      toast.error(`Failed to place sell order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Trading Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trading Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
                BUY Order
              </TabsTrigger>
              <TabsTrigger value="sell" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
                SELL Order
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="buy" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stock-select">Select Stock</Label>
                  <Select value={selectedStock} onValueChange={setSelectedStock}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NSE:RELIANCE-EQ">
                        RELIANCE - ₹{quotes["NSE:RELIANCE-EQ"]?.lastPrice.toLocaleString() || "Loading..."}
                      </SelectItem>
                      <SelectItem value="NSE:TCS-EQ">
                        TCS - ₹{quotes["NSE:TCS-EQ"]?.lastPrice.toLocaleString() || "Loading..."}
                      </SelectItem>
                      <SelectItem value="NSE:INFY-EQ">
                        INFY - ₹{quotes["NSE:INFY-EQ"]?.lastPrice.toLocaleString() || "Loading..."}
                      </SelectItem>
                      <SelectItem value="NSE:HDFCBANK-EQ">
                        HDFCBANK - ₹{quotes["NSE:HDFCBANK-EQ"]?.lastPrice.toLocaleString() || "Loading..."}
                      </SelectItem>
                      <SelectItem value="NSE:ICICIBANK-EQ">
                        ICICIBANK - ₹{quotes["NSE:ICICIBANK-EQ"]?.lastPrice.toLocaleString() || "Loading..."}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="order-type">Order Type</Label>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                      <SelectItem value="stop">Stop Loss</SelectItem>
                      <SelectItem value="stop-limit">Stop Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  {orderType !== "market" && (
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  {orderType === "market" && (
                    <div>
                      <Label>Market Price</Label>
                      <div className="mt-1 p-2 bg-muted rounded-md">
                        <span className="font-medium">₹{currentPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <h4 className="font-medium mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Stock:</span>
                      <span className="font-medium">{selectedStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-medium">{quantity || "0"} shares</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per share:</span>
                      <span className="font-medium">₹{orderType === "market" ? currentPrice.toLocaleString() : (price || "0")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brokerage (₹20):</span>
                      <span className="font-medium">₹20</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 font-medium">
                      <span>Total Amount:</span>
                      <span>₹{(orderValue + 20).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Available Funds */}
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm">Available Funds:</span>
                  </div>
                  <span className="font-medium text-primary">₹{availableFunds.toLocaleString()}</span>
                </div>

                {/* Risk Warnings */}
                {!canAfford && orderValue > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Insufficient funds for this order</span>
                  </div>
                )}

                {orderValue > availableFunds * 0.5 && canAfford && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-500/10 text-yellow-600 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Large order - consider position sizing</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-success hover:bg-success/90" 
                    disabled={!quantity || !canAfford || orderValue === 0 || isSubmitting || isLoadingMarketData}
                    onClick={handlePlaceOrder}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Buy Order"
                    )}
                  </Button>
                  <Button variant="outline" className="px-6">
                    Add to Watchlist
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4 mt-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-3">Your Holdings</h4>
                {isLoadingMarketData ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading holdings...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-background rounded border">
                      <div>
                        <p className="font-medium">TCS</p>
                        <p className="text-sm text-muted-foreground">
                          50 shares @ ₹3,200 | Current: ₹{quotes["NSE:TCS-EQ"]?.lastPrice.toLocaleString() || "--"}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleSellOrder("NSE:TCS-EQ", 50)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sell"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-background rounded border">
                      <div>
                        <p className="font-medium">INFY</p>
                        <p className="text-sm text-muted-foreground">
                          75 shares @ ₹1,650 | Current: ₹{quotes["NSE:INFY-EQ"]?.lastPrice.toLocaleString() || "--"}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleSellOrder("NSE:INFY-EQ", 75)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sell"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-background rounded border">
                      <div>
                        <p className="font-medium">HDFCBANK</p>
                        <p className="text-sm text-muted-foreground">
                          40 shares @ ₹1,680 | Current: ₹{quotes["NSE:HDFCBANK-EQ"]?.lastPrice.toLocaleString() || "--"}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleSellOrder("NSE:HDFCBANK-EQ", 40)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sell"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Trade Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => getOrders()}
          >
            <Clock className="w-4 h-4 mr-2" />
            View Pending Orders ({orders.length || 0})
            {isLoadingOrders && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Set Price Alerts
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <TrendingUp className="w-4 h-4 mr-2" />
            Portfolio Rebalance
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};