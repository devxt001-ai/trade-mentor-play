import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { portfolioService, Portfolio, PortfolioHolding, PortfolioSummary } from '@/services/portfolioService';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PortfolioContextType {
  portfolio: Portfolio | null;
  holdings: PortfolioHolding[];
  portfolioSummary: PortfolioSummary | null;
  loading: boolean;
  error: string | null;
  refreshPortfolio: () => Promise<void>;
  updateHolding: (holding: Partial<PortfolioHolding>) => Promise<void>;
  updateBalance: (newBalance: number) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export { PortfolioContext };

// Hook moved to separate file to fix Fast Refresh warnings

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const fetchPortfolioData = async () => {
    if (!isAuthenticated || !user) {
      setPortfolio(null);
      setHoldings([]);
      setPortfolioSummary(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get existing portfolio
      let portfolioData = await portfolioService.getPortfolio();
      
      // If no portfolio exists, create a default one
      if (!portfolioData) {
        portfolioData = await portfolioService.createDefaultPortfolio(user.id);
      }

      setPortfolio(portfolioData);

      // Get portfolio summary with holdings
      const summary = await portfolioService.getPortfolioSummary();
      setPortfolioSummary(summary);
      setHoldings(summary?.holdings || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio data';
      setError(errorMessage);
      console.error('Portfolio fetch error:', err);
      
      toast({
        title: "Portfolio Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshPortfolio = async () => {
    await fetchPortfolioData();
  };

  const updateHolding = async (holding: Partial<PortfolioHolding>) => {
    try {
      await portfolioService.upsertHolding(holding);
      await refreshPortfolio(); // Refresh data after update
      
      toast({
        title: "Success",
        description: "Portfolio holding updated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update holding';
      setError(errorMessage);
      
      toast({
        title: "Update Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const updateBalance = async (newBalance: number) => {
    if (!portfolio) return;
    
    try {
      await portfolioService.updatePortfolioBalance(portfolio.id, newBalance);
      await refreshPortfolio(); // Refresh data after update
      
      toast({
        title: "Success",
        description: "Portfolio balance updated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update balance';
      setError(errorMessage);
      
      toast({
        title: "Update Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Fetch portfolio data when authentication status changes
  useEffect(() => {
    fetchPortfolioData();
  }, [isAuthenticated, user]);

  // Auto-refresh portfolio data every 30 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchPortfolioData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value: PortfolioContextType = {
    portfolio,
    holdings,
    portfolioSummary,
    loading,
    error,
    refreshPortfolio,
    updateHolding,
    updateBalance,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};