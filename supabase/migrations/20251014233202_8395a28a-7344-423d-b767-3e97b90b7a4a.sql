-- Create leads table for matchmaker data
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL,
  preferred_style TEXT,
  connection_type TEXT,
  topics TEXT,
  tone TEXT,
  match_name TEXT,
  language TEXT,
  source TEXT DEFAULT 'chatgpt_matchmaker',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert (edge functions use service role key)
CREATE POLICY "Allow service role to insert leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Create policy to allow service role to read leads
CREATE POLICY "Allow service role to read leads"
ON public.leads
FOR SELECT
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();