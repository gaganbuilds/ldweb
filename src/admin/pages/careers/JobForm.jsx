import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../../services/supabase';
import TipTapEditor from '../../components/TipTapEditor'; // Reusing existing rich text editor

export default function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [categories, setCategories] = useState([]);
  const [skillsInput, setSkillsInput] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', slug: '', company_name: 'LearnDepth Academy', company_logo_url: '', 
    short_description: '', category_id: '', department: '', employment_type: 'Full-time', 
    work_mode: 'On-site', location: '', openings: 1, salary_min: '', salary_max: '', 
    salary_currency: 'INR', salary_period: 'Annual', salary_visible: true, 
    equity_compensation: '', experience_min: '', experience_max: '', experience_level: 'Entry Level', 
    description: '', responsibilities: '', required_skills: [], preferred_skills: '', 
    qualifications: '', benefits: [], application_deadline: '', application_method: 'internal', 
    application_url: '', contact_email: '', status: 'draft', seo_title: '', 
    seo_description: '', seo_keywords: '', canonical_url: '', no_index: false
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: cats } = await supabase.from('job_categories').select('id, name');
      if (cats) setCategories(cats);

      if (isEdit) {
        const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
        if (error) throw error;
        
        setFormData({
          ...data,
          application_deadline: data.application_deadline || '',
          required_skills: data.required_skills || [],
          benefits: data.benefits || [],
          salary_min: data.salary_min || '',
          salary_max: data.salary_max || '',
          experience_min: data.experience_min || '',
          experience_max: data.experience_max || ''
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (!isEdit) {
      const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData({ ...formData, title: newTitle, slug: autoSlug });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillsInput.trim() && !formData.required_skills.includes(skillsInput.trim())) {
      setFormData({
        ...formData,
        required_skills: [...formData.required_skills, skillsInput.trim()]
      });
      setSkillsInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter(s => s !== skill)
    });
  };

  const handleEditorChange = (field, content) => {
    setFormData({ ...formData, [field]: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData };
      
      // Clean numeric fields
      payload.salary_min = payload.salary_min === '' ? null : Number(payload.salary_min);
      payload.salary_max = payload.salary_max === '' ? null : Number(payload.salary_max);
      payload.experience_min = payload.experience_min === '' ? null : Number(payload.experience_min);
      payload.experience_max = payload.experience_max === '' ? null : Number(payload.experience_max);
      
      if (!isEdit && payload.status === 'published') {
        payload.published_at = new Date().toISOString();
      } else if (isEdit && payload.status === 'published' && !payload.published_at) {
        payload.published_at = new Date().toISOString();
      }
      
      let error;
      if (isEdit) {
        const { error: updateErr } = await supabase.from('jobs').update(payload).eq('id', id);
        error = updateErr;
      } else {
        const { error: insertErr } = await supabase.from('jobs').insert([payload]);
        error = insertErr;
      }

      if (error) {
        if (error.code === '23505') throw new Error('A job with this slug already exists.');
        throw error;
      }
      navigate('/admin/jobs');
    } catch (error) {
      alert(error.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="admin-page"><div className="admin-loading">Loading...</div></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <button className="admin-back-btn" onClick={() => navigate('/admin/jobs')}>
            <ArrowLeft size={20} /> Back to Jobs
          </button>
          <h1 className="admin-page-title">{isEdit ? 'Edit Job' : 'Create New Job'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select name="status" value={formData.status} onChange={handleChange} className="admin-select" style={{ width: '150px' }}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
          <button className="admin-btn-primary" onClick={handleSubmit} disabled={loading}>
            <Save size={18} /> {loading ? 'Saving...' : 'Save Job'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        
        {/* SECTION A — BASIC INFORMATION */}
        <div className="admin-card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Basic Information</h2>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Job Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleTitleChange} required className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label>URL Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="admin-input" />
            </div>
          </div>
          
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Company Name *</label>
              <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label>Company Logo URL</label>
              <input type="url" name="company_logo_url" value={formData.company_logo_url} onChange={handleChange} className="admin-input" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Job Category *</label>
              <select name="category_id" value={formData.category_id} onChange={handleChange} required className="admin-select">
                <option value="">Select a category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="admin-input" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Job Type *</label>
              <select name="employment_type" value={formData.employment_type} onChange={handleChange} required className="admin-select">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Work Mode *</label>
              <select name="work_mode" value={formData.work_mode} onChange={handleChange} required className="admin-select">
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label>Number of Openings</label>
              <input type="number" name="openings" value={formData.openings} onChange={handleChange} className="admin-input" min="1" />
            </div>
          </div>
        </div>

        {/* SECTION B — COMPENSATION */}
        <div className="admin-card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Compensation & Experience</h2>
          
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Minimum Salary</label>
              <input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label>Maximum Salary</label>
              <input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange} className="admin-input" />
            </div>
          </div>
          
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Currency</label>
              <select name="salary_currency" value={formData.salary_currency} onChange={handleChange} className="admin-select">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Salary Period</label>
              <select name="salary_period" value={formData.salary_period} onChange={handleChange} className="admin-select">
                <option value="Annual">Annual</option>
                <option value="Monthly">Monthly</option>
                <option value="Hourly">Hourly</option>
              </select>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Experience Range (Years)</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" name="experience_min" value={formData.experience_min} onChange={handleChange} placeholder="Min" className="admin-input" />
                <input type="number" name="experience_max" value={formData.experience_max} onChange={handleChange} placeholder="Max" className="admin-input" />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Experience Level</label>
              <select name="experience_level" value={formData.experience_level} onChange={handleChange} className="admin-select">
                <option value="Entry Level">Entry Level</option>
                <option value="Junior">Junior</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION D — CONTENT */}
        <div className="admin-card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Job Details</h2>
          
          <div className="admin-form-group">
            <label>Job Description</label>
            <TipTapEditor 
              content={formData.description} 
              onChange={(html) => handleEditorChange('description', html)} 
            />
          </div>
          <br/>
          
          <div className="admin-form-group">
            <label>Responsibilities</label>
            <TipTapEditor 
              content={formData.responsibilities} 
              onChange={(html) => handleEditorChange('responsibilities', html)} 
            />
          </div>
          <br/>
          
          <div className="admin-form-group">
            <label>Qualifications</label>
            <TipTapEditor 
              content={formData.qualifications} 
              onChange={(html) => handleEditorChange('qualifications', html)} 
            />
          </div>
          
          <div className="admin-form-group" style={{ marginTop: '24px' }}>
            <label>Required Skills (Tags)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input 
                type="text" 
                value={skillsInput} 
                onChange={(e) => setSkillsInput(e.target.value)} 
                className="admin-input" 
                placeholder="Type a skill and press Add" 
              />
              <button onClick={handleAddSkill} className="admin-btn-secondary">Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {formData.required_skills.map((skill, i) => (
                <span key={i} style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: '16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {skill} 
                  <button type="button" onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* SECTION J — APPLICATION SETTINGS */}
        <div className="admin-card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Application Settings</h2>
          
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Application Method</label>
              <select name="application_method" value={formData.application_method} onChange={handleChange} className="admin-select">
                <option value="internal">Internal (Platform Form)</option>
                <option value="external">External Link</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Application Deadline</label>
              <input type="text" name="application_deadline" placeholder="e.g. 31st Dec 2024" value={formData.application_deadline} onChange={handleChange} className="admin-input" />
            </div>
          </div>
          
          {formData.application_method === 'external' && (
            <div className="admin-form-group">
              <label>External Application URL</label>
              <input type="url" name="application_url" value={formData.application_url} onChange={handleChange} className="admin-input" />
            </div>
          )}
        </div>

        {/* SECTION Z — SEO Settings */}
        <div className="admin-card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>SEO Settings</h2>
          
          <div className="admin-form-group">
            <label>SEO Title (Optional - overrides default job title format)</label>
            <input type="text" name="seo_title" value={formData.seo_title} onChange={handleChange} className="admin-input" placeholder="e.g. Senior Backend Engineer Job in Bangalore | LearnDepth" />
          </div>
          
          <div className="admin-form-group">
            <label>SEO Description (Optional - overrides default job short description)</label>
            <textarea name="seo_description" value={formData.seo_description} onChange={handleChange} className="admin-input" style={{ height: '80px', resize: 'vertical' }} placeholder="Meta description for search engines..."></textarea>
          </div>
          
          <div className="admin-form-group">
            <label>Canonical URL (Optional)</label>
            <input type="url" name="canonical_url" value={formData.canonical_url} onChange={handleChange} className="admin-input" placeholder="e.g. https://www.learndepthacademy.com/careers/jobs/..." />
          </div>
          
          <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
            <input type="checkbox" name="no_index" checked={formData.no_index} onChange={handleChange} id="job_no_index" style={{ width: '18px', height: '18px' }} />
            <label htmlFor="job_no_index" style={{ margin: 0, fontWeight: 'normal' }}>No Index (Hide this job from search engines)</label>
          </div>
        </div>

      </form>
    </div>
  );
}
