-- Create enums for various types
CREATE TYPE public.experience_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE public.investment_goal AS ENUM ('learning', 'income', 'growth', 'retirement', 'speculation');
CREATE TYPE public.plan_type AS ENUM ('free', 'pro', 'custom');
CREATE TYPE public.subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'expired');
CREATE TYPE public.order_type AS ENUM ('market', 'limit', 'stop_loss', 'oco');
CREATE TYPE public.order_status AS ENUM ('pending', 'executed', 'cancelled', 'rejected');
CREATE TYPE public.transaction_type AS ENUM ('credit', 'debit', 'bonus', 'refund', 'purchase');
CREATE TYPE public.notification_type AS ENUM ('price_alert', 'portfolio_update', 'risk_warning', 'challenge', 'tip', 'system');
CREATE TYPE public.challenge_status AS ENUM ('active', 'completed', 'failed', 'expired');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  experience_level experience_level DEFAULT 'beginner',
  investment_goals investment_goal[] DEFAULT '{}',
  risk_tolerance INTEGER DEFAULT 5 CHECK (risk_tolerance >= 1 AND risk_tolerance <= 10),
  phone TEXT,
  country TEXT,
  timezone TEXT DEFAULT 'UTC',
  avatar_url TEXT,
  is_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  plan_type plan_type NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  billing_period TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
  credits_allocated INTEGER NOT NULL DEFAULT 0,
  max_positions INTEGER NOT NULL DEFAULT 10,
  analytics_enabled BOOLEAN DEFAULT FALSE,
  protips_enabled BOOLEAN DEFAULT FALSE,
  priority_support BOOLEAN DEFAULT FALSE,
  custom_features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status subscription_status NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Credits tracking table
CREATE TABLE public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  available_credits DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_credits_earned DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_credits_spent DECIMAL(15,2) NOT NULL DEFAULT 0,
  last_topup_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Credit transactions table
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  transaction_type transaction_type NOT NULL,
  description TEXT,
  related_order_id UUID,
  related_subscription_id UUID REFERENCES public.user_subscriptions(id),
  balance_after DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stocks master table
CREATE TABLE public.stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  exchange TEXT NOT NULL,
  sector TEXT,
  industry TEXT,
  market_cap DECIMAL(20,2),
  current_price DECIMAL(10,4),
  price_change DECIMAL(10,4),
  price_change_percent DECIMAL(8,4),
  volume BIGINT,
  avg_volume BIGINT,
  last_updated TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User portfolios table
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Portfolio',
  description TEXT,
  initial_balance DECIMAL(15,2) NOT NULL DEFAULT 100000,
  current_balance DECIMAL(15,2) NOT NULL DEFAULT 100000,
  total_invested DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_returns DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_returns_percent DECIMAL(8,4) NOT NULL DEFAULT 0,
  day_change DECIMAL(15,2) NOT NULL DEFAULT 0,
  day_change_percent DECIMAL(8,4) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Portfolio holdings table
CREATE TABLE public.portfolio_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  stock_id UUID NOT NULL REFERENCES public.stocks(id),
  quantity INTEGER NOT NULL DEFAULT 0,
  avg_buy_price DECIMAL(10,4) NOT NULL,
  current_price DECIMAL(10,4) NOT NULL,
  market_value DECIMAL(15,2) NOT NULL,
  unrealized_pnl DECIMAL(15,2) NOT NULL DEFAULT 0,
  unrealized_pnl_percent DECIMAL(8,4) NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(portfolio_id, stock_id)
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  stock_id UUID NOT NULL REFERENCES public.stocks(id),
  order_type order_type NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,4),
  stop_price DECIMAL(10,4),
  status order_status NOT NULL DEFAULT 'pending',
  filled_quantity INTEGER DEFAULT 0,
  filled_price DECIMAL(10,4),
  fees DECIMAL(10,4) DEFAULT 0,
  slippage DECIMAL(8,4) DEFAULT 0,
  execution_time TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trades table (executed orders)
CREATE TABLE public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id),
  stock_id UUID NOT NULL REFERENCES public.stocks(id),
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  fees DECIMAL(10,4) NOT NULL DEFAULT 0,
  realized_pnl DECIMAL(15,2),
  executed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ProTips table
CREATE TABLE public.protips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  trigger_conditions JSONB,
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User ProTips table
CREATE TABLE public.user_protips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protip_id UUID NOT NULL REFERENCES public.protips(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ
);

-- Challenges table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL,
  target_value DECIMAL(15,2),
  target_metric TEXT, -- e.g., 'returns_percent', 'win_rate', 'trades_count'
  duration_days INTEGER DEFAULT 30,
  reward_credits DECIMAL(10,2) DEFAULT 0,
  reward_badge_id UUID,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User challenges table
CREATE TABLE public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  status challenge_status NOT NULL DEFAULT 'active',
  progress DECIMAL(8,4) DEFAULT 0,
  current_value DECIMAL(15,2) DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  reward_claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMPTZ,
  UNIQUE(user_id, challenge_id)
);

-- Badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_url TEXT,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  unlock_criteria JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  progress DECIMAL(8,4) DEFAULT 100,
  UNIQUE(user_id, badge_id)
);

-- Leaderboards table
CREATE TABLE public.leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  metric TEXT NOT NULL, -- e.g., 'total_returns', 'win_rate', 'portfolio_value'
  period TEXT NOT NULL DEFAULT 'monthly', -- daily, weekly, monthly, yearly, all_time
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Leaderboard entries table
CREATE TABLE public.leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leaderboard_id UUID NOT NULL REFERENCES public.leaderboards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  score DECIMAL(15,4) NOT NULL,
  portfolio_id UUID REFERENCES public.portfolios(id),
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(leaderboard_id, user_id)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type notification_type NOT NULL,
  related_entity_id UUID,
  related_entity_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin settings table
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Compliance logs table
CREATE TABLE public.compliance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, plan_type, price, credits_allocated, max_positions, analytics_enabled, protips_enabled, priority_support) VALUES
('Free Trial', 'free', 0, 10000, 5, FALSE, FALSE, FALSE),
('Pro Plan', 'pro', 29.99, 100000, 50, TRUE, TRUE, TRUE),
('Custom Plan', 'custom', 99.99, 500000, 200, TRUE, TRUE, TRUE);

-- Insert default badges
INSERT INTO public.badges (name, description, rarity, unlock_criteria) VALUES
('First Trade', 'Complete your first trade', 'common', '{"trades_count": 1}'),
('Profitable Trader', 'Achieve positive returns', 'common', '{"total_returns_percent": 0}'),
('Risk Manager', 'Maintain portfolio below 5% daily loss for 30 days', 'rare', '{"max_daily_loss": 5, "streak_days": 30}'),
('Market Veteran', 'Complete 1000 trades', 'epic', '{"trades_count": 1000}'),
('Portfolio Master', 'Achieve 50% returns', 'legendary', '{"total_returns_percent": 50}');

-- Insert default challenges
INSERT INTO public.challenges (title, description, challenge_type, target_value, target_metric, duration_days, reward_credits, start_date, end_date) VALUES
('Beat the Market', 'Outperform S&P 500 this month', 'performance', 10, 'returns_percent', 30, 500, now(), now() + interval '30 days'),
('Consistency Challenge', 'Make profitable trades 10 days in a row', 'streak', 10, 'profitable_days_streak', 30, 1000, now(), now() + interval '30 days'),
('Volume Trader', 'Complete 100 trades this month', 'activity', 100, 'trades_count', 30, 750, now(), now() + interval '30 days');

-- Insert default leaderboards
INSERT INTO public.leaderboards (name, description, metric, period) VALUES
('Monthly Returns', 'Top performers by monthly returns', 'total_returns_percent', 'monthly'),
('All-Time Champions', 'All-time best performers', 'total_returns_percent', 'all_time'),
('Most Active Traders', 'Most trades completed this month', 'trades_count', 'monthly');

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_user_credits_user_id ON public.user_credits(user_id);
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at);
CREATE INDEX idx_stocks_symbol ON public.stocks(symbol);
CREATE INDEX idx_stocks_is_active ON public.stocks(is_active);
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_portfolio_holdings_portfolio_id ON public.portfolio_holdings(portfolio_id);
CREATE INDEX idx_portfolio_holdings_stock_id ON public.portfolio_holdings(stock_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_portfolio_id ON public.orders(portfolio_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_portfolio_id ON public.trades(portfolio_id);
CREATE INDEX idx_trades_executed_at ON public.trades(executed_at);
CREATE INDEX idx_user_protips_user_id ON public.user_protips(user_id);
CREATE INDEX idx_user_protips_is_read ON public.user_protips(is_read);
CREATE INDEX idx_user_challenges_user_id ON public.user_challenges(user_id);
CREATE INDEX idx_user_challenges_status ON public.user_challenges(status);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_leaderboard_entries_leaderboard_id ON public.leaderboard_entries(leaderboard_id);
CREATE INDEX idx_leaderboard_entries_rank ON public.leaderboard_entries(rank);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_compliance_logs_user_id ON public.compliance_logs(user_id);
CREATE INDEX idx_compliance_logs_created_at ON public.compliance_logs(created_at);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_protips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user-specific data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Everyone can view subscription plans" ON public.subscription_plans FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own subscriptions" ON public.user_subscriptions FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own credits" ON public.user_credits FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own credits" ON public.user_credits FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert own credits" ON public.user_credits FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own credit transactions" ON public.credit_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own credit transactions" ON public.credit_transactions FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Everyone can view active stocks" ON public.stocks FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own portfolios" ON public.portfolios FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own portfolios" ON public.portfolios FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own portfolios" ON public.portfolios FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own portfolio holdings" ON public.portfolio_holdings FOR SELECT USING (
  portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage own portfolio holdings" ON public.portfolio_holdings FOR ALL USING (
  portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own trades" ON public.trades FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own trades" ON public.trades FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Everyone can view active protips" ON public.protips FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own protips" ON public.user_protips FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own protips" ON public.user_protips FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Everyone can view active challenges" ON public.challenges FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own challenges" ON public.user_challenges FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own challenges" ON public.user_challenges FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Everyone can view active badges" ON public.badges FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own badges" ON public.user_badges FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own badges" ON public.user_badges FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Everyone can view active leaderboards" ON public.leaderboards FOR SELECT USING (is_active = true);

CREATE POLICY "Everyone can view leaderboard entries" ON public.leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "Users can insert leaderboard entries" ON public.leaderboard_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update leaderboard entries" ON public.leaderboard_entries FOR UPDATE USING (true);

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Admin and system policies (will need admin role implementation later)
CREATE POLICY "System can manage admin settings" ON public.admin_settings FOR ALL USING (true);
CREATE POLICY "System can insert compliance logs" ON public.compliance_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "System can view compliance logs" ON public.compliance_logs FOR SELECT USING (true);

-- Create functions for automatic profile creation and credit allocation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Create initial credits
  INSERT INTO public.user_credits (user_id, available_credits, total_credits_earned)
  VALUES (NEW.id, 10000, 10000);
  
  -- Create initial credit transaction
  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description, balance_after)
  VALUES (NEW.id, 10000, 'bonus', 'Welcome bonus credits', 10000);
  
  -- Create default portfolio
  INSERT INTO public.portfolios (user_id, name, initial_balance, current_balance)
  VALUES (NEW.id, 'My Portfolio', 100000, 100000);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user setup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON public.user_credits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stocks_updated_at BEFORE UPDATE ON public.stocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolio_holdings_updated_at BEFORE UPDATE ON public.portfolio_holdings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_protips_updated_at BEFORE UPDATE ON public.protips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON public.badges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leaderboards_updated_at BEFORE UPDATE ON public.leaderboards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON public.admin_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();