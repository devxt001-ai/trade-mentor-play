-- Enable RLS on all tables that need it
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_settings (admin only)
CREATE POLICY "System can manage admin settings" 
ON public.admin_settings 
FOR ALL 
USING (true);

-- Create RLS policies for badges (everyone can view active badges)
CREATE POLICY "Everyone can view active badges" 
ON public.badges 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for challenges (everyone can view active challenges)  
CREATE POLICY "Everyone can view active challenges" 
ON public.challenges 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for notifications (users can only access their own)
CREATE POLICY "Users can view own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create RLS policies for orders (users can only access their own)
CREATE POLICY "Users can view own orders" 
ON public.orders 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own orders" 
ON public.orders 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create RLS policies for portfolio_holdings (users can only access their own portfolio holdings)
CREATE POLICY "Users can view own portfolio holdings" 
ON public.portfolio_holdings 
FOR SELECT 
USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own portfolio holdings" 
ON public.portfolio_holdings 
FOR ALL 
USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

-- Create RLS policies for portfolios (users can only access their own portfolios)
CREATE POLICY "Users can view own portfolios" 
ON public.portfolios 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create own portfolios" 
ON public.portfolios 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own portfolios" 
ON public.portfolios 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create RLS policies for profiles (users can only access their own profile)
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create RLS policies for protips (everyone can view active protips)
CREATE POLICY "Everyone can view active protips" 
ON public.protips 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for stocks (everyone can view active stocks)
CREATE POLICY "Everyone can view active stocks" 
ON public.stocks 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for subscription_plans (everyone can view active plans)
CREATE POLICY "Everyone can view subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for trades (users can only access their own trades)
CREATE POLICY "Users can view own trades" 
ON public.trades 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create own trades" 
ON public.trades 
FOR INSERT 
WITH CHECK (user_id = auth.uid());