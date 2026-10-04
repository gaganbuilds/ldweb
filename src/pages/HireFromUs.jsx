import { useState } from 'react';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, LoaderCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import FourWaysToPartner from '../components/FourWaysToPartner';
import HireTalentDomains from '../components/HireTalentDomains';
import HireProcessTimeline from '../components/HireProcessTimeline';
import PartnerInstitutes from '../components/PartnerInstitutes';
import { hireFromUsService } from '../admin/services/hireFromUsService';
import './HireFromUs.css';

const selects = {
  industry: ['IT / Software', 'AI / Data Science', 'FinTech', 'EdTech', 'HealthTech', 'E-commerce', 'SaaS', 'Consulting', 'Manufacturing', 'Other'],
  number_of_openings: ['1', '2–5', '6–10', '11–25', '25+'],
  experience_required: ['Freshers', '0–1 Years', '1–2 Years', '2–3 Years', '3+ Years'],
  work_mode: ['On-site', 'Hybrid', 'Remote'],
  hiring_timeline: ['Immediately', 'Within 2 Weeks', 'Within 1 Month', '1–3 Months', 'Flexible']
};
const labels = { recruiter_name: 'Recruiter / Hiring Manager Name', work_email: 'Work Email', phone: 'Phone Number', designation: 'Designation', company_name: 'Company Name', company_website: 'Company Website', industry: 'Industry', company_location: 'Company Location', job_role: 'Job Role / Position', number_of_openings: 'Number of Openings', experience_required: 'Required Experience', required_skills: 'Required Skills', work_mode: 'Work Mode', job_location: 'Job Location', salary_range: 'Expected Salary Range', hiring_timeline: 'Expected Hiring Timeline', job_description: 'Job Description / Hiring Details', jd_url: 'JD Link (optional)' };
const required = Object.keys(labels).filter(k => !['company_website', 'salary_range', 'jd_url'].includes(k));
const empty = Object.fromEntries(Object.keys(labels).map(k => [k, '']));
const placeholder = { recruiter_name: 'Enter Full Name', work_email: 'Work Email', phone: 'Mobile Number', designation: 'e.g. HR Manager / Founder / Talent Acquisition', company_website: 'https://company.com', company_location: 'City, State', job_role: 'e.g. Data Analyst', required_skills: 'Python, SQL, React, Machine Learning...', job_location: 'Job Location', salary_range: 'e.g. ₹3–5 LPA', job_description: 'Tell us about the role, responsibilities, required skills and other hiring requirements...', jd_url: 'https://...' };

export default function HireFromUs() {
  const [form, setForm] = useState(empty), [errors, setErrors] = useState({}), [state, setState] = useState('idle');
  const change = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const field = key => {
    const props = { id: key, name: key, value: form[key], required: required.includes(key), 'aria-invalid': !!errors[key], onChange: e => { change(key, e.target.value); setErrors(old => ({ ...old, [key]: undefined })); } };
    let control;
    if (selects[key]) control = <select {...props}><option value="">Select {labels[key].toLowerCase()}</option>{selects[key].map(option => <option key={option}>{option}</option>)}</select>;
    else if (key === 'job_description') control = <textarea {...props} rows="3" maxLength="3000" placeholder={placeholder[key]} />;
    else control = <input {...props} type={key === 'work_email' ? 'email' : ['phone'].includes(key) ? 'tel' : ['company_website', 'jd_url'].includes(key) ? 'url' : 'text'} maxLength="300" placeholder={placeholder[key] || ''} />;
    return <div className={`hire-field ${key === 'job_description' ? 'hire-wide' : ''}`} key={key}><label htmlFor={key}>{labels[key]}{required.includes(key) && <b> *</b>}</label>{control}{errors[key] && <small>{errors[key]}</small>}</div>;
  };
  const submit = async e => {
    e.preventDefault(); if (state === 'submitting') return;
    const next = {};
    required.forEach(k => { if (!form[k].trim()) next[k] = 'This field is required.'; });
    if (form.work_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.work_email)) next.work_email = 'Enter a valid work email address.';
    if (form.phone && !/^\+?[\d\s().-]{8,20}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number.';
    for (const k of ['company_website', 'jd_url']) if (form[k] && !/^https?:\/\//i.test(form[k])) next[k] = 'Enter a link starting with https://.';
    setErrors(next); if (Object.keys(next).length) { document.getElementById(Object.keys(next)[0])?.focus(); return; }
    setState('submitting');
    try {
      const { error } = await hireFromUsService.createLead({ ...form, status: 'New', priority: 'Medium' });
      setState(error ? 'error' : 'success'); if (!error) setForm(empty);
    } catch { setState('error'); }
  };
  return <div className="hire-page">
    <SEOHead title="Hire Trained Tech Talent | LearnDepth Academy" description="Hire trained and industry-ready technology talent from LearnDepth Academy. Share your hiring requirements and connect with skilled candidates across Data Science, AI, Full Stack Development and more." canonicalUrl="https://www.learndepthacademy.com/hire-from-us" />
    <Navbar />
    <main className="hire-hero"><div className="hire-layout">
      <section className="hire-copy"><div className="hire-eyebrow"><BriefcaseBusiness size={16} /> HIRING PARTNERSHIPS</div><h1>Build Your Team With<br /><span>Job-Ready Tech Talent</span></h1>
        <p className="hire-desc">Connect with trained and industry-ready talent from LearnDepth across Data Science, AI, Full Stack Development, Python, Java, Web Development and other in-demand technology domains.</p>
        <p className="hire-note">Tell us your hiring requirements and our team will connect with you with relevant candidates.</p>
        <div className="hire-stats">{[['ZERO', 'Recruiter Hiring Fee'], ['<1 Week', 'Quick Turnaround Time'], ['45+', 'Hiring Partners'], ['7000+', 'Students Trained']].map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
      </section>
      <section className="hire-card" id="hire-form-section"><header><span>LEARNDEPTH HIRING PARTNERSHIPS</span><h2>Tell Us Your Hiring Requirements</h2><p>Share your requirements and our hiring team will get in touch with you.</p></header>
        {state === 'success' ? <div className="hire-success" role="status"><CheckCircle2 size={34} /><strong>Thank you!</strong><p>Our hiring team will contact you shortly.</p><button onClick={() => setState('idle')}>Submit another requirement</button></div> : <form onSubmit={submit} noValidate>
          <h3>Contact details</h3><div className="hire-fields">{['recruiter_name', 'work_email', 'phone', 'designation'].map(field)}</div>
          <h3>Company details</h3><div className="hire-fields">{['company_name', 'company_website', 'industry', 'company_location'].map(field)}</div>
          <h3>Hiring requirement</h3><div className="hire-fields">{['job_role', 'number_of_openings', 'experience_required', 'work_mode', 'required_skills', 'job_location', 'salary_range', 'hiring_timeline', 'job_description', 'jd_url'].map(field)}</div>
          {state === 'error' && <p className="hire-error" role="alert">Something went wrong. Please try again.</p>}
          <button className="hire-submit" disabled={state === 'submitting'}>{state === 'submitting' ? <><LoaderCircle className="hire-spin" size={18} /> Submitting...</> : <>Connect With Our Hiring Team <ArrowRight size={18} /></>}</button><p className="hire-privacy">Your details are shared only with our hiring team.</p>
        </form>}
      </section>
    </div></main>
    <FourWaysToPartner />
    <PartnerInstitutes />
    <HireTalentDomains />
    <HireProcessTimeline />
    <Footer />
  </div>;
}
