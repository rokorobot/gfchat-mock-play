-- Add user_id column to leads table to link leads with authenticated users
ALTER TABLE public.leads 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_leads_user_id ON public.leads(user_id);

COMMENT ON COLUMN public.leads.user_id IS 'Links the lead to an authenticated user after they sign up/login';