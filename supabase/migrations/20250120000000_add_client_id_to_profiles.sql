-- Add client_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN client_id TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_profiles_client_id ON public.profiles(client_id);

-- Function to generate unique 7-character alphanumeric client ID
CREATE OR REPLACE FUNCTION generate_client_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
    char_index INTEGER;
BEGIN
    FOR i IN 1..7 LOOP
        char_index := floor(random() * length(chars) + 1);
        result := result || substr(chars, char_index, 1);
    END LOOP;
    
    -- Check if client_id already exists, if so generate a new one
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE client_id = result) LOOP
        result := '';
        FOR i IN 1..7 LOOP
            char_index := floor(random() * length(chars) + 1);
            result := result || substr(chars, char_index, 1);
        END LOOP;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to automatically generate client_id for new users
CREATE OR REPLACE FUNCTION set_client_id_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.client_id IS NULL THEN
        NEW.client_id := generate_client_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate client_id on insert
CREATE TRIGGER trigger_set_client_id
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_client_id_on_insert();

-- Generate client_id for existing users (if any)
UPDATE public.profiles 
SET client_id = generate_client_id() 
WHERE client_id IS NULL;