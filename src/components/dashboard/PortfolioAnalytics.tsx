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
import { TrendingUp, TrendingDown, Activity, PieChart as PieChartIcon, BarChart3, Calendar } from "lucide-react";

export const PortfolioAnalytics = () => {
  // Sample data for charts
  const portfolioPerformance = [
    { date: "Jan", value: 1000000, benchmark: 1000000 },
    { date: "Feb", value: 1025000, benchmark: 1015000 },
    { date: "Mar", value: 1045000, benchmark: 1020000 },
    { date: "Apr", value: 1038000, benchmark: 1025000 },
    { date: "May", value: 1065000, benchmark: 1030000 },
    { date: "Jun", value: 1089000, benchmark: 1045000 },
    { date: "Jul", value: 1112000, benchmark: 1055000 },
    { date: "Aug", value: 1125000, benchmark: 1070000 },
    { date: "Sep", value: 1158000, benchmark: 1085000 },
  ];

  const sectorAllocation = [
    { sector: "IT", value: 35, amount: 410750 },
    { sector: "Banking", value: 28, amount: 329300 },
    { sector: "Healthcare", value: 15, amount: 176250 },
    { sector: "Energy", value: 12, amount: 141150 },
    { sector: "Auto", value: 10, amount: 117750 },
  ];

  const monthlyReturns = [
    { month: "Jan", returns: 2.5 },
    { month: "Feb", returns: 1.8 },
    { month: "Mar", returns: -0.7 },
    { month: "Apr", returns: 2.9 },
    { month: "May", returns: 1.2 },
    { month: "Jun", returns: 3.1 },
    { month: "Jul", returns: 0.9 },
    { month: "Aug", returns: 2.8 },
    { month: "Sep", returns: 1.5 },
  ];

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  const metrics = [
    { label: "Total Return", value: "+15.8%", change: "+2.3%", trend: "up", color: "success" },
    { label: "Sharpe Ratio", value: "1.34", change: "+0.12", trend: "up", color: "primary" },
    { label: "Max Drawdown", value: "-3.2%", change: "+0.8%", trend: "up", color: "destructive" },
    { label: "Win Rate", value: "73%", change: "+5%", trend: "up", color: "success" },
    { label: "Beta", value: "0.89", change: "-0.05", trend: "down", color: "muted" },
    { label: "Alpha", value: "2.1%", change: "+0.3%", trend: "up", color: "premium" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Portfolio Analytics</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button variant="ghost" size="sm">Export Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric) => (
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
                      dataKey="benchmark" 
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
                        data={sectorAllocation}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({sector, value}) => `${sector}: ${value}%`}
                      >
                        {sectorAllocation.map((entry, index) => (
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
                {sectorAllocation.map((sector, index) => (
                  <div key={sector.sector} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{sector.sector}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{sector.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{sector.value}%</p>
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