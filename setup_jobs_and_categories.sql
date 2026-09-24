-- Job Categories Table
CREATE TABLE IF NOT EXISTS public.job_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    is_featured BOOLEAN DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    company_logo_url TEXT,
    short_description TEXT,
    category_id UUID REFERENCES public.job_categories(id),
    department TEXT,
    employment_type TEXT NOT NULL, -- Full-time, Part-time, Internship, Contract, Freelance
    work_mode TEXT NOT NULL, -- Remote, Hybrid, On-site
    location TEXT,
    openings INTEGER DEFAULT 1,
    
    salary_min NUMERIC,
    salary_max NUMERIC,
    salary_currency TEXT DEFAULT 'INR',
    salary_period TEXT, -- Annual, Monthly, Hourly
    salary_visible BOOLEAN DEFAULT true,
    equity_compensation TEXT,
    
    experience_min INTEGER,
    experience_max INTEGER,
    experience_level TEXT, -- Entry Level, Junior, Mid Level, Senior, Lead
    
    description TEXT,
    responsibilities TEXT,
    required_skills JSONB DEFAULT '[]'::jsonb, -- Array of strings
    preferred_skills TEXT,
    qualifications TEXT,
    benefits JSONB DEFAULT '[]'::jsonb,
    
    application_deadline TEXT,
    application_method TEXT DEFAULT 'internal', -- internal, external
    application_url TEXT,
    contact_email TEXT,
    
    status TEXT DEFAULT 'draft', -- draft, published, closed, expired, archived
    job_status TEXT DEFAULT 'open', -- kept for backward compat with earlier code
    
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    canonical_url TEXT,
    no_index BOOLEAN DEFAULT false,
    
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Job Applications
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_reference TEXT UNIQUE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    current_city TEXT,
    state TEXT,
    country TEXT,
    current_status TEXT NOT NULL,
    organization TEXT,
    present_role TEXT,
    qualification TEXT NOT NULL,
    degree TEXT,
    specialization TEXT,
    college TEXT,
    graduation_year TEXT,
    experience_years TEXT,
    experience_level TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    experience_summary TEXT,
    resume_path TEXT NOT NULL,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    other_url TEXT,
    cover_letter TEXT,
    custom_answers JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'New', -- New, Under Review, Shortlisted, Interview, Selected, Rejected, Withdrawn
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Saved Jobs
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- References auth.users if auth is implemented, else might be tracking device/anon
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, job_id)
);


-- RLS Configuration

-- job_categories
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on active job_categories" ON public.job_categories;
DROP POLICY IF EXISTS "Allow authenticated read on all job_categories" ON public.job_categories;
DROP POLICY IF EXISTS "Allow authenticated full access on job_categories" ON public.job_categories;

CREATE POLICY "Allow public read on active job_categories" ON public.job_categories FOR SELECT TO public USING (status = 'active');
CREATE POLICY "Allow authenticated read on all job_categories" ON public.job_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access on job_categories" ON public.job_categories FOR ALL TO authenticated USING (true);

-- jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on published open jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow public read on published jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow authenticated full access on jobs" ON public.jobs;

CREATE POLICY "Allow public read on published jobs" ON public.jobs FOR SELECT TO public USING (status = 'published');
CREATE POLICY "Allow authenticated full access on jobs" ON public.jobs FOR ALL TO authenticated USING (true);

-- job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public to insert applications" ON public.job_applications;
DROP POLICY IF EXISTS "Allow authenticated full access on applications" ON public.job_applications;

CREATE POLICY "Allow public to insert applications" ON public.job_applications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on applications" ON public.job_applications FOR ALL TO authenticated USING (true);

-- saved_jobs
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to read their saved jobs" ON public.saved_jobs;
DROP POLICY IF EXISTS "Allow users to save jobs" ON public.saved_jobs;
DROP POLICY IF EXISTS "Allow users to delete saved jobs" ON public.saved_jobs;

CREATE POLICY "Allow users to read their saved jobs" ON public.saved_jobs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow users to save jobs" ON public.saved_jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to delete saved jobs" ON public.saved_jobs FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_job_categories_updated_at ON public.job_categories;
CREATE TRIGGER set_job_categories_updated_at
BEFORE UPDATE ON public.job_categories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_jobs_updated_at ON public.jobs;
CREATE TRIGGER set_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_job_applications_updated_at ON public.job_applications;
CREATE TRIGGER set_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Generate application reference
CREATE SEQUENCE IF NOT EXISTS public.application_ref_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_application_reference()
RETURNS trigger AS $$
BEGIN
  IF NEW.application_reference IS NULL THEN
    NEW.application_reference := 'LD-APP-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.application_ref_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_application_reference ON public.job_applications;
CREATE TRIGGER set_application_reference
BEFORE INSERT ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION public.generate_application_reference();

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
