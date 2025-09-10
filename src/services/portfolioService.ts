import { supabase } from '../integrations/supabase/client';
import { withErrorHandling } from '../utils/errorHandling';

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  initial_balance: number;
  current_balance: number;
  total_invested: number;
  total_returns: number;
  total_returns_percent: number;
  day_change: number;
  day_change_percent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioHolding {
  id: string;
  portfolio_id: string;
  stock_id: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  unrealized_pnl_percent: number;
  last_updated: string;
  created_at: string;
  updated_at: string;
  // Joined stock data
  stock?: {
    symbol: string;
    name: string;
    sector: string;
  };
}

export interface PortfolioSummary {
  portfolio: Portfolio;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  availableCash: number;
}

export const portfolioService = {
  // Get user's active portfolio
  getPortfolio: withErrorHandling(async (): Promise<Portfolio | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }, 'Failed to fetch portfolio'),

  // Get portfolio holdings with stock details
  getPortfolioHoldings: withErrorHandling(async (portfolioId: string): Promise<PortfolioHolding[]> => {
    const { data, error } = await supabase
      .from('portfolio_holdings')
      .select(`
        *,
        stock:stocks(
          symbol,
          name,
          sector
        )
      `)
      .eq('portfolio_id', portfolioId)
      .gt('quantity', 0);

    if (error) throw error;

    return data || [];
  }, 'Failed to fetch portfolio holdings'),

  // Get complete portfolio summary
  getPortfolioSummary: withErrorHandling(async (): Promise<PortfolioSummary | null> => {
    const portfolio = await portfolioService.getPortfolio();
    if (!portfolio) return null;

    const holdings = await portfolioService.getPortfolioHoldings(portfolio.id);
    
    const totalValue = holdings.reduce((sum, holding) => sum + holding.market_value, 0);
    const totalPnL = holdings.reduce((sum, holding) => sum + holding.unrealized_pnl, 0);
    const totalPnLPercent = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0;
    const availableCash = portfolio.current_balance;

    return {
      portfolio,
      holdings,
      totalValue,
      totalPnL,
      totalPnLPercent,
      availableCash
    };
  }, 'Failed to fetch portfolio summary'),

  // Update portfolio balance
  updatePortfolioBalance: withErrorHandling(async (portfolioId: string, newBalance: number): Promise<void> => {
    const { error } = await supabase
      .from('portfolios')
      .update({ 
        current_balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', portfolioId);

    if (error) throw error;
  }, 'Failed to update portfolio balance'),

  // Add or update holding
  upsertHolding: withErrorHandling(async (holding: Partial<PortfolioHolding>): Promise<void> => {
    // Exclude the 'stock' property as it's a joined field, not a database column
    const { stock, ...holdingData } = holding;
    
    // Ensure required fields are present for upsert
    const upsertData = {
      ...holdingData,
      last_updated: new Date().toISOString(),
      // Ensure required fields have default values if not provided
      avg_buy_price: holdingData.avg_buy_price || 0,
      current_price: holdingData.current_price || 0,
      market_value: holdingData.market_value || 0,
      portfolio_id: holdingData.portfolio_id || '',
      stock_id: holdingData.stock_id || ''
    };
    
    const { error } = await supabase
      .from('portfolio_holdings')
      .upsert(upsertData);

    if (error) throw error;
  }, 'Failed to update holding'),

  // Create initial portfolio for new user
  createDefaultPortfolio: withErrorHandling(async (userId: string): Promise<Portfolio> => {
    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: userId,
        name: 'My Portfolio',
        initial_balance: 100000,
        current_balance: 100000
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }, 'Failed to create default portfolio')
};