import { useContext } from 'react';
import { MarketDataContext } from '@/contexts/MarketDataContext';

export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};