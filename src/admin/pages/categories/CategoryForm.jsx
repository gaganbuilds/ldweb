import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, FolderOpen } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import '../../styles/admin.css';

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    seo_title: '',
    seo_description: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadCategory();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      const categories = await cmsService.getCategories();
      const cat = categories.find(c => c.id === id);
      if (cat) {
        setFormData(cat);
      } else {
        alert('Category not found.');
        navigate('/admin/categories');
      }
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'name' && !isEditing) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await cmsService.updateCategory(id, formData);
      } else {
        await cmsService.createCategory(formData);
      }
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-title">
          <Link to="/admin/categories" className="admin-back-btn">
            <ArrowLeft size={20} />
          </Link>
          <FolderOpen size={24} color="#4f46e5" />
          <h1>{isEditing ? 'Edit Category' : 'Add New Category'}</h1>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="admin-btn primary">
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Category'}
        </button>
      </div>

      <div className="admin-content-grid">
        <div className="admin-main-col">
          <div className="admin-card">
            <h3>Category Details</h3>
            
            <div className="admin-form-group">
              <label>Category Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="admin-input"
              />
            </div>
            
            <div className="admin-form-group">
              <label>URL Slug *</label>
              <input 
                type="text" 
                name="slug" 
                value={formData.slug} 
                onChange={handleChange} 
                required 
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="admin-textarea"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card">
            <h3>SEO Settings</h3>
            <div className="admin-form-group">
              <label>SEO Title</label>
              <input 
                type="text" 
                name="seo_title" 
                value={formData.seo_title} 
                onChange={handleChange} 
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label>Meta Description</label>
              <textarea 
                name="seo_description" 
                value={formData.seo_description} 
                onChange={handleChange} 
                className="admin-textarea"
                rows="4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
