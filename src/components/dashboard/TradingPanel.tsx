import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, DollarSign, TrendingUp, Clock, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const TradingPanel = () => {
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [selectedStock, setSelectedStock] = useState("RELIANCE");
  
  const currentPrice = 2847.50;
  const availableFunds = 245000;
  
  const calculateOrderValue = () => {
    const qty = parseInt(quantity) || 0;
    const orderPrice = orderType === "market" ? currentPrice : (parseFloat(price) || 0);
    return qty * orderPrice;
  };

  const orderValue = calculateOrderValue();
  const canAfford = orderValue <= availableFunds;

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
                      <SelectItem value="RELIANCE">RELIANCE - ₹2,847.50</SelectItem>
                      <SelectItem value="TCS">TCS - ₹3,456.20</SelectItem>
                      <SelectItem value="INFY">INFY - ₹1,789.40</SelectItem>
                      <SelectItem value="HDFCBANK">HDFCBANK - ₹1,634.80</SelectItem>
                      <SelectItem value="ICICIBANK">ICICIBANK - ₹945.30</SelectItem>
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
                    disabled={!quantity || !canAfford || orderValue === 0}
                  >
                    Place Buy Order
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-background rounded border">
                    <div>
                      <p className="font-medium">TCS</p>
                      <p className="text-sm text-muted-foreground">50 shares @ ₹3,200</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                      Sell
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-background rounded border">
                    <div>
                      <p className="font-medium">INFY</p>
                      <p className="text-sm text-muted-foreground">75 shares @ ₹1,650</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                      Sell
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-background rounded border">
                    <div>
                      <p className="font-medium">HDFCBANK</p>
                      <p className="text-sm text-muted-foreground">40 shares @ ₹1,680</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                      Sell
                    </Button>
                  </div>
                </div>
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
          <Button variant="outline" className="w-full justify-start">
            <Clock className="w-4 h-4 mr-2" />
            View Pending Orders (3)
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