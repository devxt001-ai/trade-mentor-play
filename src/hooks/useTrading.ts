import { useContext } from 'react';
import { TradingContext } from '@/contexts/TradingContext';

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};