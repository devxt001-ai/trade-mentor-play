-- Add fyers_access_token column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN fyers_access_token TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN public.profiles.fyers_access_token IS 'Stores the Fyers API access token for authenticated users';

-- Create index for faster lookups (optional, but good for performance)
CREATE INDEX idx_profiles_fyers_token ON public.profiles(fyers_access_token) WHERE fyers_access_token IS NOT NULL;