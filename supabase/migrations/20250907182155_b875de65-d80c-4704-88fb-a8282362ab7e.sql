-- Drop existing triggers first to avoid conflicts
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- Drop existing tables to recreate with simplified structure
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.user_challenges CASCADE;
DROP TABLE IF EXISTS public.user_credits CASCADE;
DROP TABLE IF EXISTS public.user_protips CASCADE;
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;
DROP TABLE IF EXISTS public.credit_transactions CASCADE;
DROP TABLE IF EXISTS public.leaderboard_entries CASCADE;
DROP TABLE IF EXISTS public.leaderboards CASCADE;
DROP TABLE IF EXISTS public.compliance_logs CASCADE;

-- Update profiles table to include consolidated user data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits_available numeric DEFAULT 10000,
ADD COLUMN IF NOT EXISTS credits_total_earned numeric DEFAULT 10000,
ADD COLUMN IF NOT EXISTS credits_total_spent numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_credit_topup timestamp with time zone,
ADD COLUMN IF NOT EXISTS badges_earned jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS active_challenges jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS protips_seen jsonb DEFAULT '[]'::jsonb;

-- Update challenges table to include user tracking
ALTER TABLE public.challenges
ADD COLUMN IF NOT EXISTS user_progress jsonb DEFAULT '{}'::jsonb;

-- Update protips table to include user interaction tracking  
ALTER TABLE public.protips
ADD COLUMN IF NOT EXISTS user_interactions jsonb DEFAULT '{}'::jsonb;

-- Create simplified subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  status subscription_status NOT NULL DEFAULT 'active'::subscription_status,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  stripe_subscription_id text,
  stripe_customer_id text,
  credit_transactions jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on new subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (user_id = auth.uid());

-- Recreate triggers for updated tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update the new user handler function to work with simplified schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create user profile with initial credits
  INSERT INTO public.profiles (
    user_id, 
    email, 
    full_name,
    credits_available,
    credits_total_earned
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    10000,
    10000
  );
  
  -- Create default portfolio
  INSERT INTO public.portfolios (user_id, name, initial_balance, current_balance)
  VALUES (NEW.id, 'My Portfolio', 100000, 100000);
  
  RETURN NEW;
END;
$function$;