import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  TrendingUp, 
  PieChart, 
  Trophy, 
  Bell, 
  BarChart3,
  DollarSign,
  Activity,
  User,
  Settings,
  LogOut
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MarketFeed } from "@/components/dashboard/MarketFeed";
import { TradingPanel } from "@/components/dashboard/TradingPanel";
import { PortfolioAnalytics } from "@/components/dashboard/PortfolioAnalytics";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";

export const Dashboard = () => {
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
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard with Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Market
            </TabsTrigger>
            <TabsTrigger value="trading" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trading
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardLayout />
          </TabsContent>

          <TabsContent value="market">
            <MarketFeed />
          </TabsContent>

          <TabsContent value="trading">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TradingPanel />
              </div>
              <div className="lg:col-span-2">
                <MarketFeed />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <PortfolioAnalytics />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};