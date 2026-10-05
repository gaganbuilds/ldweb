-- Create the table for Internship Applications
CREATE TABLE IF NOT EXISTS public.internship_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college_university TEXT NOT NULL,
    course_degree TEXT NOT NULL,
    current_year TEXT NOT NULL,
    preferred_domain TEXT NOT NULL,
    how_heard TEXT NOT NULL,
    how_heard_other TEXT,
    
    status TEXT DEFAULT 'New' NOT NULL,
    priority TEXT DEFAULT 'Normal' NOT NULL,
    admin_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- Allow public users (anonymous) to insert new applications
CREATE POLICY "Allow public insert on internship_applications" 
ON public.internship_applications 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow authenticated users (admin) to select, update, and delete applications
CREATE POLICY "Allow authenticated read on internship_applications" 
ON public.internship_applications 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated update on internship_applications" 
ON public.internship_applications 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete on internship_applications" 
ON public.internship_applications 
FOR DELETE 
TO authenticated 
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at_internship_apps()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_internship_applications_updated_at ON public.internship_applications;
CREATE TRIGGER set_internship_applications_updated_at
BEFORE UPDATE ON public.internship_applications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at_internship_apps();
