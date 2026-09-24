-- Create the table for Internship Enquiries
CREATE TABLE IF NOT EXISTS public.internship_enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college TEXT NOT NULL,
    current_year TEXT NOT NULL,
    interested_internship TEXT NOT NULL,
    message TEXT,
    
    status TEXT DEFAULT 'New' NOT NULL,
    priority TEXT DEFAULT 'Medium' NOT NULL,
    notes TEXT,
    assigned_to TEXT,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    source_page TEXT,
    
    activity_history JSONB DEFAULT '[]'::jsonb NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.internship_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow public users (anonymous) to insert new enquiries
CREATE POLICY "Allow public insert on internship_enquiries" 
ON public.internship_enquiries 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow authenticated users (admin) to select, update, and delete enquiries
CREATE POLICY "Allow authenticated read on internship_enquiries" 
ON public.internship_enquiries 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated update on internship_enquiries" 
ON public.internship_enquiries 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete on internship_enquiries" 
ON public.internship_enquiries 
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

DROP TRIGGER IF EXISTS set_internship_enquiries_updated_at ON public.internship_enquiries;
CREATE TRIGGER set_internship_enquiries_updated_at
BEFORE UPDATE ON public.internship_enquiries
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
