import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Trash2, Users } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../services/supabase';
import '../../styles/admin.css';

export default function AuthorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    short_bio: '',
    long_bio: '',
    image_url: '',
    linkedin_url: '',
    website_url: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadAuthor();
    }
  }, [id]);

  const loadAuthor = async () => {
    try {
      setLoading(true);
      const authors = await cmsService.getAuthors();
      const author = authors.find(a => a.id === id);
      if (author) {
        setFormData(author);
      } else {
        alert('Author not found.');
        navigate('/admin/authors');
      }
    } catch (error) {
      console.error('Error loading author:', error);
      alert('Failed to load author data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `author-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await cmsService.updateAuthor(id, formData);
      } else {
        await cmsService.createAuthor(formData);
      }
      navigate('/admin/authors');
    } catch (error) {
      console.error('Error saving author:', error);
      alert('Error saving author.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-title">
          <Link to="/admin/authors" className="admin-back-btn">
            <ArrowLeft size={20} />
          </Link>
          <Users size={24} color="#4f46e5" />
          <h1>{isEditing ? 'Edit Author' : 'Add New Author'}</h1>
        </div>
        <button onClick={handleSubmit} disabled={loading || uploading} className="admin-btn primary">
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Author'}
        </button>
      </div>

      <div className="admin-content-grid">
        <div className="admin-main-col">
          <div className="admin-card">
            <h3>Author Information</h3>
            
            <div className="admin-form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="admin-input"
                placeholder="e.g. Jane Doe"
              />
            </div>
            
            <div className="admin-form-group">
              <label>Designation / Title</label>
              <input 
                type="text" 
                name="designation" 
                value={formData.designation} 
                onChange={handleChange} 
                className="admin-input"
                placeholder="e.g. Senior Data Scientist"
              />
            </div>

            <div className="admin-form-group">
              <label>Short Bio</label>
              <textarea 
                name="short_bio" 
                value={formData.short_bio} 
                onChange={handleChange} 
                className="admin-textarea"
                rows="3"
                placeholder="A brief 1-2 sentence bio for article footers."
              />
            </div>
            
            <div className="admin-form-group">
              <label>Long Bio (Optional)</label>
              <textarea 
                name="long_bio" 
                value={formData.long_bio} 
                onChange={handleChange} 
                className="admin-textarea"
                rows="6"
                placeholder="Full biography for a dedicated author page."
              />
            </div>
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card">
            <h3>Profile Image</h3>
            
            {formData.image_url ? (
              <div className="admin-image-preview">
                <img src={formData.image_url} alt="Profile Preview" />
                <button type="button" onClick={handleRemoveImage} className="admin-remove-image">
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            ) : (
              <div 
                className="admin-image-upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={32} color="#9ca3af" />
                <p>{uploading ? 'Uploading...' : 'Click to upload profile image'}</p>
                <span className="admin-upload-hint">Square format recommended (e.g., 400x400)</span>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <div className="admin-card">
            <h3>Social Links</h3>
            <div className="admin-form-group">
              <label>LinkedIn URL</label>
              <input 
                type="url" 
                name="linkedin_url" 
                value={formData.linkedin_url} 
                onChange={handleChange} 
                className="admin-input"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="admin-form-group">
              <label>Personal Website</label>
              <input 
                type="url" 
                name="website_url" 
                value={formData.website_url} 
                onChange={handleChange} 
                className="admin-input"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
