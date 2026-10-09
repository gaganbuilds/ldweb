-- Setup Script for Certificate Verification System
-- Run this in Supabase SQL Editor

-- 1. Create certificate_categories table
CREATE TABLE IF NOT EXISTS public.certificate_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial category: Internship
INSERT INTO public.certificate_categories (name, slug, description, active)
VALUES ('Internship', 'internship', 'Internship certificates issued by LearnDepth Academy', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number TEXT NOT NULL UNIQUE,
    recipient_name TEXT NOT NULL,
    certificate_title TEXT NOT NULL,
    category_id UUID REFERENCES public.certificate_categories(id) ON DELETE RESTRICT,
    issued_date DATE NOT NULL,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'valid' CHECK (status IN ('valid', 'revoked')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by certificate number
CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_number ON public.certificates(certificate_number);

-- Enable RLS
ALTER TABLE public.certificate_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- Allow public read access to active categories (optional, but good for verification if needed)
CREATE POLICY "Public read active categories" ON public.certificate_categories
    FOR SELECT USING (active = true);

-- Allow public to read specific certificate fields for verification
-- We can let anyone read certificates (public verification), 
-- but frontend will only query by certificate_number.
CREATE POLICY "Public can verify certificate" ON public.certificates
    FOR SELECT USING (true);

-- Admins can do everything
-- Note: Assuming the project uses profiles.role = 'admin' for auth. 
-- Will use standard authenticated user check if we don't have custom claims, 
-- but usually admin tables check auth.uid() in a profiles table.
-- Using simple auth check for insertion/update/deletion:

CREATE POLICY "Admins can insert categories" ON public.certificate_categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update categories" ON public.certificate_categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete categories" ON public.certificate_categories
    FOR DELETE USING (auth.role() = 'authenticated');


CREATE POLICY "Admins can insert certificates" ON public.certificates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update certificates" ON public.certificates
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete certificates" ON public.certificates
    FOR DELETE USING (auth.role() = 'authenticated');
