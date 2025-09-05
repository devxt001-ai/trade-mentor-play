import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Brain, 
  Shield, 
  Zap, 
  Trophy, 
  BarChart3, 
  Users, 
  Smartphone,
  AlertTriangle 
} from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Market Simulation",
      description: "Trade with live market data, realistic spreads, and execution delays that mirror actual trading conditions.",
      badge: "Core Feature",
      gradient: "from-primary to-primary-glow"
    },
    {
      icon: Brain,
      title: "AI-Powered ProTips",
      description: "Get intelligent suggestions on position sizing, risk management, and trade timing based on your trading patterns.",
      badge: "Pro Feature",
      gradient: "from-premium to-premium-glow"
    },
    {
      icon: Shield,
      title: "Advanced Risk Management",
      description: "Built-in position limits, margin calculations, and daily loss caps to teach responsible trading habits.",
      badge: "Safety First",
      gradient: "from-success to-success-light"
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "Track your performance with detailed reports, win rates, drawdown analysis, and benchmark comparisons.",
      badge: "Analytics",
      gradient: "from-primary to-premium"
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Complete challenges, earn badges, climb leaderboards, and compete with traders worldwide.",
      badge: "Engagement",
      gradient: "from-premium to-success"
    },
    {
      icon: Users,
      title: "Community & Social Trading",
      description: "Join trading communities, share strategies, and learn from successful traders on the platform.",
      badge: "Social",
      gradient: "from-success to-primary"
    },
    {
      icon: Zap,
      title: "Multi-Asset Trading",
      description: "Trade stocks, ETFs, futures, and options across NSE and BSE with support for all order types.",
      badge: "Versatile",
      gradient: "from-primary to-destructive"
    },
    {
      icon: Smartphone,
      title: "Cross-Platform Access",
      description: "Trade seamlessly across web, iOS, and Android with real-time sync and offline capabilities.",
      badge: "Mobile Ready",
      gradient: "from-premium to-primary"
    },
    {
      icon: AlertTriangle,
      title: "Smart Alerts & Notifications",
      description: "Get notified about price movements, portfolio updates, risk warnings, and trading opportunities.",
      badge: "Stay Informed",
      gradient: "from-destructive to-premium"
    }
  ];

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to Master Trading
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From beginners to professionals, our comprehensive platform provides all the tools 
            and insights you need to become a successful trader.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-trading transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="w-fit text-xs">
                  {feature.badge}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-success mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Active Traders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-premium mb-2">₹500Cr+</div>
              <div className="text-sm text-muted-foreground">Traded Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-destructive mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};