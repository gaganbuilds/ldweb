import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../../services/supabase';

// Predefined icons matching lucide-react names supported by the frontend
const ICONS = [
  { value: 'Code', label: 'Code (Development)' },
  { value: 'BrainCircuit', label: 'Brain (AI & ML)' },
  { value: 'PenTool', label: 'Pen Tool (Design)' },
  { value: 'LayoutTemplate', label: 'Layout (UI/UX)' },
  { value: 'Network', label: 'Network (IT/Systems)' },
  { value: 'Server', label: 'Server (Backend)' },
  { value: 'Database', label: 'Database (Data)' },
  { value: 'TrendingUp', label: 'Trending (Marketing/Sales)' },
  { value: 'MonitorSmartphone', label: 'Devices (Mobile/Web)' }
];

export default function JobCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Code',
    display_order: 0,
    status: 'active',
    is_featured: false,
    seo_title: '',
    seo_description: '',
    seo_keywords: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('job_categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          icon: data.icon || 'Code',
          display_order: data.display_order || 0,
          status: data.status || 'active',
          is_featured: data.is_featured || false,
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
          seo_keywords: data.seo_keywords || ''
        });
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      alert('Failed to load category data');
      navigate('/admin/job-categories');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    // Auto-generate slug if not editing an existing one manually
    if (!isEdit) {
      const autoSlug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData({ ...formData, name: newName, slug: autoSlug });
    } else {
      setFormData({ ...formData, name: newName });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData };
      
      let error;
      
      if (isEdit) {
        const { error: updateError } = await supabase
          .from('job_categories')
          .update(payload)
          .eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('job_categories')
          .insert([payload]);
        error = insertError;
      }

      if (error) {
        if (error.code === '23505') {
          throw new Error('A category with this slug already exists.');
        }
        throw error;
      }

      navigate('/admin/job-categories');
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="admin-page"><div className="admin-loading">Loading...</div></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <button className="admin-back-btn" onClick={() => navigate('/admin/job-categories')}>
            <ArrowLeft size={20} /> Back to Categories
          </button>
          <h1 className="admin-page-title">{isEdit ? 'Edit Category' : 'Create New Category'}</h1>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} className="admin-form">
          
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Category Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="admin-input"
                placeholder="e.g. Software Development"
              />
            </div>
            
            <div className="admin-form-group">
              <label>Slug *</label>
              <input 
                type="text" 
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="admin-input"
                placeholder="e.g. software-development"
              />
              <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Used in URL (e.g. /careers/jobs?category=slug)
              </span>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Short Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="admin-input"
              rows="3"
              placeholder="Appears on the category card (max 2-3 lines recommended)"
            ></textarea>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Icon</label>
              <select 
                name="icon" 
                value={formData.icon} 
                onChange={handleChange}
                className="admin-select"
              >
                {ICONS.map(icon => (
                  <option key={icon.value} value={icon.value}>{icon.label}</option>
                ))}
              </select>
            </div>
            
            <div className="admin-form-group">
              <label>Display Order</label>
              <input 
                type="number" 
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                className="admin-input"
                min="0"
              />
            </div>
            
            <div className="admin-form-group">
              <label>Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="admin-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0' }}>
            <input 
              type="checkbox" 
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="is_featured" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>
              Featured Category
            </label>
            <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '10px' }}>
              (Featured categories are shown on the main Careers hero section)
            </span>
          </div>

          <hr style={{ margin: '30px 0', borderColor: '#e2e8f0' }} />
          <h3 style={{ marginBottom: '20px' }}>SEO Settings</h3>

          <div className="admin-form-group">
            <label>SEO Title</label>
            <input 
              type="text" 
              name="seo_title"
              value={formData.seo_title}
              onChange={handleChange}
              className="admin-input"
              placeholder="e.g. Software Development Jobs at LearnDepth"
            />
          </div>
          
          <div className="admin-form-group">
            <label>SEO Description</label>
            <textarea 
              name="seo_description"
              value={formData.seo_description}
              onChange={handleChange}
              className="admin-input"
              rows="2"
            ></textarea>
          </div>
          
          <div className="admin-form-group">
            <label>SEO Keywords</label>
            <input 
              type="text" 
              name="seo_keywords"
              value={formData.seo_keywords}
              onChange={handleChange}
              className="admin-input"
              placeholder="e.g. software jobs, developer, frontend, backend (comma separated)"
            />
          </div>

          <div className="admin-form-actions" style={{ marginTop: '30px', display: 'flex', gap: '16px' }}>
            <button 
              type="button" 
              className="admin-btn-secondary"
              onClick={() => navigate('/admin/job-categories')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="admin-btn-primary"
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
