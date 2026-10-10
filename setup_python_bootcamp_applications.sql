-- Create the table for Python Bootcamp Applications
CREATE TABLE IF NOT EXISTS public.python_bootcamp_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college_university TEXT NOT NULL,
    course_degree TEXT NOT NULL,
    current_year TEXT NOT NULL,
    python_skill_level TEXT NOT NULL,
    primary_goal TEXT NOT NULL,
    how_heard TEXT NOT NULL,
    how_heard_other TEXT,
    consent_to_contact BOOLEAN NOT NULL DEFAULT true,
    
    application_status TEXT DEFAULT 'New' NOT NULL,
    payment_status TEXT DEFAULT 'Not Started' NOT NULL,
    admin_notes TEXT,
    
    source_page TEXT DEFAULT '/python-bootcamp',
    program_name TEXT DEFAULT '30-Day Python Bootcamp',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.python_bootcamp_applications ENABLE ROW LEVEL SECURITY;

-- Allow public users (anonymous) to insert new applications
CREATE POLICY "Allow public insert on python_bootcamp_applications" 
ON public.python_bootcamp_applications 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow authenticated users (admin) to select, update, and delete applications
CREATE POLICY "Allow authenticated read on python_bootcamp_applications" 
ON public.python_bootcamp_applications 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated update on python_bootcamp_applications" 
ON public.python_bootcamp_applications 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete on python_bootcamp_applications" 
ON public.python_bootcamp_applications 
FOR DELETE 
TO authenticated 
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at_python_bootcamp_apps()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_python_bootcamp_applications_updated_at ON public.python_bootcamp_applications;
CREATE TRIGGER set_python_bootcamp_applications_updated_at
BEFORE UPDATE ON public.python_bootcamp_applications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at_python_bootcamp_apps();
