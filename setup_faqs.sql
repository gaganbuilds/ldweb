-- Create FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    page_assignment JSONB DEFAULT '["home", "about"]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active FAQs
CREATE POLICY "Allow public read access to active FAQs" ON public.faqs
    FOR SELECT USING (is_active = true);

-- Allow authenticated admins full access
CREATE POLICY "Allow authenticated full access to faqs" ON public.faqs
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_faqs_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_faqs_updated_at_column();

-- Insert initial 10 FAQs
INSERT INTO public.faqs (question, answer, display_order, page_assignment) VALUES
('What programs does LearnDepth offer?', 'LearnDepth offers industry-focused learning programs across areas such as Full Stack Development, Data Science, Machine Learning, AI, Python, Java, DSA, Cloud, DevOps and other emerging technology domains. Program availability may vary based on the current learning calendar.', 1, '["home", "about"]'),
('Who can join LearnDepth programs?', 'LearnDepth programs are designed for students, graduates, beginners and learners looking to build or strengthen technology skills. Eligibility and prerequisites may differ depending on the specific program.', 2, '["home", "about"]'),
('Are LearnDepth programs beginner-friendly?', 'Yes. Several programs are designed with structured learning paths for beginners, while advanced programs are available for learners who already have foundational knowledge. The recommended level will be clearly mentioned for each program.', 3, '["home", "about"]'),
('Do LearnDepth programs include practical projects?', 'Yes. Practical learning is an important part of the LearnDepth approach. Depending on the program, learners may work on projects, assignments, assessments and other hands-on activities designed to help them apply what they learn.', 4, '["home", "about"]'),
('Does LearnDepth provide internship opportunities?', 'LearnDepth offers internship and experiential learning opportunities through selected programs and initiatives. Availability, eligibility, duration and selection processes can vary by program or opportunity.', 5, '["home", "about"]'),
('Will I receive a certificate after completing a program?', 'Certificate availability depends on the specific program and its completion requirements. Where applicable, learners who successfully meet the required criteria can receive a LearnDepth certificate.', 6, '["home", "about"]'),
('Is mentorship or learning support available?', 'Selected LearnDepth programs include mentorship, guidance or structured learner support. The exact level of mentorship and support depends on the program you choose.', 7, '["home", "about"]'),
('Can LearnDepth help me become career-ready?', 'LearnDepth focuses on practical skills, projects, assessments and career-oriented learning experiences. Certain programs may also include interview preparation, portfolio development, mentorship or other career-readiness activities.', 8, '["home", "about"]'),
('How do I choose the right program for me?', 'You can explore programs based on your current skill level, interests, career goals and preferred technology domain. If you are unsure, you can contact the LearnDepth team for guidance about the available options.', 9, '["home", "about"]'),
('How can I contact LearnDepth for more information?', 'You can contact the LearnDepth team through the contact options available on the website. You can also use the enquiry forms provided across the website to share your details and receive further information.', 10, '["home", "about"]');

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
