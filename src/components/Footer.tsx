import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">TradeSim Pro</span>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Master stock trading risk-free with our advanced simulation platform. 
              Learn, practice, and excel in the markets.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>🏆 Best FinTech App 2024</p>
              <p>🛡️ Bank-grade Security</p>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="/dashboard" className="hover:text-primary transition-colors">Trading Dashboard</a></li>
              <li><a href="/analytics" className="hover:text-primary transition-colors">Analytics</a></li>
              <li><a href="/mobile" className="hover:text-primary transition-colors">Mobile Apps</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/help" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="/tutorials" className="hover:text-primary transition-colors">Trading Tutorials</a></li>
              <li><a href="/api" className="hover:text-primary transition-colors">API Docs</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact Support</a></li>
              <li><a href="/status" className="hover:text-primary transition-colors">System Status</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/careers" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="/press" className="hover:text-primary transition-colors">Press Kit</a></li>
              <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
            <Button variant="premium" size="sm">
              Start Trading Free
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 TradeSim Pro. All rights reserved. Trading involves risk.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>🇮🇳 Made in India</span>
            <span>📱 iOS & Android</span>
            <span>🔒 SEBI Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};