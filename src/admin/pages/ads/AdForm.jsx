import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Megaphone } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import '../../styles/admin.css';

export default function AdForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    cta_text: '',
    cta_url: '',
    image_url: '',
    position: 'sidebar',
    status: 'active'
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadAd();
    }
  }, [id]);

  const loadAd = async () => {
    try {
      setLoading(true);
      const ads = await cmsService.getAds();
      const ad = ads.find(a => a.id === id);
      if (ad) {
        setFormData(ad);
      } else {
        alert('Ad not found.');
        navigate('/admin/ads');
      }
    } catch (error) {
      console.error('Error loading ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await cmsService.updateAd(id, formData);
      } else {
        await cmsService.createAd(formData);
      }
      navigate('/admin/ads');
    } catch (error) {
      console.error('Error saving ad:', error);
      alert('Error saving ad.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-title">
          <Link to="/admin/ads" className="admin-back-btn">
            <ArrowLeft size={20} />
          </Link>
          <Megaphone size={24} color="#4f46e5" />
          <h1>{isEditing ? 'Edit Ad' : 'Create New Ad'}</h1>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="admin-btn primary">
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Ad'}
        </button>
      </div>

      <div className="admin-content-grid">
        <div className="admin-main-col">
          <div className="admin-card">
            <h3>Ad Details</h3>
            
            <div className="admin-form-group">
              <label>Ad Name (Internal) *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="admin-input"
                placeholder="e.g. Data Science Course Promo"
              />
            </div>
            
            <div className="admin-form-group">
              <label>Headline (Title) *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
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

            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>CTA Button Text</label>
                <input 
                  type="text" 
                  name="cta_text" 
                  value={formData.cta_text} 
                  onChange={handleChange} 
                  className="admin-input"
                  placeholder="e.g. Enroll Now"
                />
              </div>
              
              <div className="admin-form-group" style={{ flex: 2 }}>
                <label>CTA URL</label>
                <input 
                  type="url" 
                  name="cta_url" 
                  value={formData.cta_url} 
                  onChange={handleChange} 
                  className="admin-input"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card">
            <h3>Placement & Status</h3>
            <div className="admin-form-group">
              <label>Position</label>
              <select 
                name="position" 
                value={formData.position} 
                onChange={handleChange} 
                className="admin-input"
              >
                <option value="sidebar">Sidebar (Right)</option>
                <option value="in_content">In Content</option>
                <option value="bottom">Bottom (Recommended Articles)</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="admin-input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
