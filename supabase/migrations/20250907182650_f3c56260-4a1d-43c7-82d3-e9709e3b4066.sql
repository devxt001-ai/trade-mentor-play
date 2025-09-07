-- Drop all existing policies and objects to recreate cleanly
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TABLE IF EXISTS public.subscriptions CASCADE;

-- Drop the problematic tables
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.user_challenges CASCADE;
DROP TABLE IF EXISTS public.user_credits CASCADE;
DROP TABLE IF EXISTS public.user_protips CASCADE;
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;
DROP TABLE IF EXISTS public.credit_transactions CASCADE;
DROP TABLE IF EXISTS public.leaderboard_entries CASCADE;
DROP TABLE IF EXISTS public.leaderboards CASCADE;
DROP TABLE IF EXISTS public.compliance_logs CASCADE;

-- Clean up profiles table columns first (drop if they exist)
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS credits_available,
DROP COLUMN IF EXISTS credits_total_earned,
DROP COLUMN IF EXISTS credits_total_spent,
DROP COLUMN IF EXISTS last_credit_topup,
DROP COLUMN IF EXISTS badges_earned,
DROP COLUMN IF EXISTS active_challenges,
DROP COLUMN IF EXISTS protips_seen;

-- Add consolidated columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN credits_available numeric DEFAULT 10000,
ADD COLUMN credits_total_earned numeric DEFAULT 10000,
ADD COLUMN credits_total_spent numeric DEFAULT 0,
ADD COLUMN last_credit_topup timestamp with time zone,
ADD COLUMN badges_earned jsonb DEFAULT '[]'::jsonb,
ADD COLUMN active_challenges jsonb DEFAULT '[]'::jsonb,
ADD COLUMN protips_seen jsonb DEFAULT '[]'::jsonb;

-- Clean up challenges table
ALTER TABLE public.challenges
DROP COLUMN IF EXISTS user_progress;

ALTER TABLE public.challenges
ADD COLUMN user_progress jsonb DEFAULT '{}'::jsonb;

-- Clean up protips table  
ALTER TABLE public.protips
DROP COLUMN IF EXISTS user_interactions;

ALTER TABLE public.protips
ADD COLUMN user_interactions jsonb DEFAULT '{}'::jsonb;

-- Create new simplified subscriptions table
CREATE TABLE public.subscriptions (
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

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Add triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();