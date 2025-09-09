import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X,
  Settings,
  Clock
} from "lucide-react";
import { useState } from "react";

export const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "price_alert",
      title: "RELIANCE crossed ₹2,850",
      message: "Your price alert for RELIANCE has been triggered. Current price: ₹2,847.50",
      timestamp: "2 minutes ago",
      read: false,
      icon: TrendingUp,
      color: "success"
    },
    {
      id: 2,
      type: "risk_warning",
      title: "Portfolio Risk Alert",
      message: "Your portfolio concentration in IT sector is above 35%. Consider diversification.",
      timestamp: "15 minutes ago",
      read: false,
      icon: AlertTriangle,
      color: "warning"
    },
    {
      id: 3,
      type: "trade_executed",
      title: "Order Executed",
      message: "Buy order for 50 shares of TCS executed at ₹3,456.20",
      timestamp: "1 hour ago",
      read: true,
      icon: CheckCircle,
      color: "success"
    },
    {
      id: 4,
      type: "market_news",
      title: "Market Update",
      message: "NIFTY 50 reaches new monthly high of 19,745 points",
      timestamp: "2 hours ago",
      read: true,
      icon: Info,
      color: "info"
    },
    {
      id: 5,
      type: "price_drop",
      title: "HDFCBANK dropped 2%",
      message: "HDFCBANK is down 2.1% in the last hour. Current price: ₹1,634.80",
      timestamp: "3 hours ago",
      read: false,
      icon: TrendingDown,
      color: "destructive"
    }
  ]);

  const alerts = [
    {
      id: 1,
      stock: "RELIANCE",
      condition: "Above ₹2,850",
      status: "triggered",
      created: "2 days ago"
    },
    {
      id: 2,
      stock: "TCS",
      condition: "Below ₹3,400",
      status: "active",
      created: "1 week ago"
    },
    {
      id: 3,
      stock: "INFY",
      condition: "Above ₹1,800",
      status: "active",
      created: "3 days ago"
    }
  ];

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'text-success bg-success/10';
      case 'warning': return 'text-yellow-600 bg-yellow-500/10';
      case 'destructive': return 'text-destructive bg-destructive/10';
      case 'info': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All Read
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 hover:bg-muted/30 transition-colors ${
                      !notification.read 
                        ? `border-l-${notification.color} bg-${notification.color}/5` 
                        : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getColorClass(notification.color)}`}>
                        <notification.icon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {notifications.length === 0 && (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Price Alerts</CardTitle>
                <Button variant="outline" size="sm">
                  Create Alert
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h3 className="font-medium">{alert.stock}</h3>
                      <p className="text-sm text-muted-foreground">{alert.condition}</p>
                      <p className="text-xs text-muted-foreground">Created {alert.created}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={alert.status === 'triggered' ? 'destructive' : 'secondary'}
                      >
                        {alert.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Price Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get notified when stocks hit your target prices</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Trade Confirmations</h3>
                    <p className="text-sm text-muted-foreground">Notifications for executed trades</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Risk Warnings</h3>
                    <p className="text-sm text-muted-foreground">Alerts for portfolio risk and concentration</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Market News</h3>
                    <p className="text-sm text-muted-foreground">Important market updates and news</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Daily Summary</h3>
                    <p className="text-sm text-muted-foreground">End of day portfolio summary</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};