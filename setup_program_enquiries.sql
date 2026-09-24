-- Create the table for Program Enquiries
CREATE TABLE IF NOT EXISTS public.program_enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    qualification TEXT NOT NULL,
    college TEXT,
    graduation_year TEXT,
    program_id TEXT,
    program_name TEXT NOT NULL,
    learning_preference TEXT,
    preferred_batch TEXT,
    current_status TEXT,
    enquiry_reason TEXT,
    message TEXT,
    
    lead_status TEXT DEFAULT 'New' NOT NULL,
    priority TEXT DEFAULT 'Normal' NOT NULL,
    assigned_to TEXT,
    notes TEXT,
    source TEXT DEFAULT 'Website - Program Enquiry' NOT NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    activity_history JSONB DEFAULT '[]'::jsonb NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.program_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow public users (anonymous) to insert new enquiries
CREATE POLICY "Allow public insert on program_enquiries" 
ON public.program_enquiries 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow authenticated users (admin) to select, update, and delete enquiries
CREATE POLICY "Allow authenticated read on program_enquiries" 
ON public.program_enquiries 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated update on program_enquiries" 
ON public.program_enquiries 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete on program_enquiries" 
ON public.program_enquiries 
FOR DELETE 
TO authenticated 
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_program_enquiries_updated_at ON public.program_enquiries;
CREATE TRIGGER set_program_enquiries_updated_at
BEFORE UPDATE ON public.program_enquiries
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
