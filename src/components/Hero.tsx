import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/trading-hero.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Professional Trading Dashboard" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-premium/10 border border-premium/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-premium" />
            <span className="text-sm font-medium text-premium">Launch Special: 30 Days Free Trial</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Master Stock Trading
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Risk-Free</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Practice trading with virtual money, learn from AI-powered insights, and compete with traders worldwide. 
            Build confidence before risking real capital.
          </p>

          {/* Key Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span><strong className="text-success">₹1 Crore+</strong> Virtual Capital</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span><strong className="text-primary">Real-time</strong> Market Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-premium" />
              <span><strong className="text-premium">AI-Powered</strong> ProTips</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="hero" className="group">
              Start Trading Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="hero">
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-sm text-muted-foreground">
            <p className="mb-4">Trusted by 50,000+ traders • Featured in TechCrunch, YourStory</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              <span>🏆 Best FinTech App 2024</span>
              <span>🛡️ Bank-grade Security</span>
              <span>📱 iOS & Android Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-success/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-premium/10 rounded-full blur-xl"></div>
    </section>
  );
};