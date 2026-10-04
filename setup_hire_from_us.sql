-- Dedicated company hiring enquiry table. Existing enquiry tables are untouched.
CREATE TABLE IF NOT EXISTS public.hire_from_us_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  recruiter_name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  designation TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_website TEXT,
  industry TEXT NOT NULL,
  company_location TEXT NOT NULL,
  job_role TEXT NOT NULL,
  number_of_openings TEXT NOT NULL,
  experience_required TEXT NOT NULL,
  required_skills TEXT NOT NULL,
  work_mode TEXT NOT NULL,
  job_location TEXT NOT NULL,
  salary_range TEXT,
  hiring_timeline TEXT NOT NULL,
  job_description TEXT NOT NULL,
  jd_url TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  priority TEXT NOT NULL DEFAULT 'Medium',
  admin_notes TEXT,
  assigned_to TEXT,
  last_contacted_at TIMESTAMPTZ,
  CONSTRAINT hire_from_us_status_check CHECK (status IN ('New', 'Contacted', 'Requirement Discussed', 'Candidates Shared', 'Interview Scheduled', 'Hiring in Progress', 'Closed', 'Not Interested')),
  CONSTRAINT hire_from_us_priority_check CHECK (priority IN ('Low', 'Medium', 'High'))
);

ALTER TABLE public.hire_from_us_leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can submit hire from us leads" ON public.hire_from_us_leads;
CREATE POLICY "Public can submit hire from us leads" ON public.hire_from_us_leads FOR INSERT TO anon, authenticated WITH CHECK (status = 'New' AND priority = 'Medium');
DROP POLICY IF EXISTS "Authenticated admins can read hire from us leads" ON public.hire_from_us_leads;
CREATE POLICY "Authenticated admins can read hire from us leads" ON public.hire_from_us_leads FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated admins can update hire from us leads" ON public.hire_from_us_leads;
CREATE POLICY "Authenticated admins can update hire from us leads" ON public.hire_from_us_leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated admins can delete hire from us leads" ON public.hire_from_us_leads;
CREATE POLICY "Authenticated admins can delete hire from us leads" ON public.hire_from_us_leads FOR DELETE TO authenticated USING (true);
GRANT INSERT ON public.hire_from_us_leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.hire_from_us_leads TO authenticated;
CREATE INDEX IF NOT EXISTS hire_from_us_leads_created_at_idx ON public.hire_from_us_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS hire_from_us_leads_status_idx ON public.hire_from_us_leads (status);
CREATE INDEX IF NOT EXISTS hire_from_us_leads_priority_idx ON public.hire_from_us_leads (priority);
