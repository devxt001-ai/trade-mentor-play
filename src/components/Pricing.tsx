import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Users } from "lucide-react";

export const Pricing = () => {
  const plans = [
    {
      name: "Free Trial",
      icon: Zap,
      price: "₹0",
      period: "30 days",
      description: "Perfect for beginners to start learning",
      features: [
        "₹5 Lakh virtual capital",
        "Basic market data (15min delay)",
        "5 trades per day",
        "Basic portfolio analytics",
        "Educational content",
        "Community access"
      ],
      variant: "outline" as const,
      buttonText: "Start Free Trial",
      popular: false
    },
    {
      name: "Pro Trader",
      icon: Crown,
      price: "₹799",
      period: "per month",
      description: "For serious traders who want to excel",
      features: [
        "₹50 Lakh virtual capital",
        "Real-time market data",
        "Unlimited trades",
        "Advanced analytics & reports",
        "AI-powered ProTips",
        "Risk management tools",
        "Priority support",
        "Monthly challenges"
      ],
      variant: "premium" as const,
      buttonText: "Go Pro Now",
      popular: true
    },
    {
      name: "Enterprise",
      icon: Users,
      price: "₹2,999",
      period: "per month",
      description: "For teams and trading institutions",
      features: [
        "₹1 Crore virtual capital per seat",
        "Multiple user seats (5+)",
        "Custom risk parameters",
        "Team leaderboards",
        "Advanced reporting dashboard",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options"
      ],
      variant: "trading" as const,
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Pricing Plans</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Trading Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you're ready to take your trading skills to the next level
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'ring-2 ring-premium shadow-premium' : ''} hover:shadow-trading transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-premium text-premium-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <plan.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <Button variant={plan.variant} className="w-full mb-6">
                  {plan.buttonText}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include bank-grade security, mobile apps, and 24/7 support
          </p>
          <Button variant="ghost" className="text-primary">
            Compare All Features →
          </Button>
        </div>
      </div>
    </section>
  );
};