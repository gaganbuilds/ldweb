import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { testimonialService } from '../../services/testimonialService';
import { ArrowLeft, Upload, X, User } from 'lucide-react';
import styles from '../../../components/LearnerTestimonials.module.css'; // For preview

export default function TestimonialForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    linkedin_url: '',
    content: '',
    category: '',
    tags: [],
    display_order: 0,
    status: 'draft',
    profile_image_url: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchTestimonial();
    }
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getTestimonialById(id);
      setFormData({
        name: data.name,
        bio: data.bio,
        linkedin_url: data.linkedin_url,
        content: data.content,
        category: data.category || '',
        tags: data.tags || [],
        display_order: data.display_order || 0,
        status: data.status,
        profile_image_url: data.profile_image_url || ''
      });
      if (data.profile_image_url) {
        setImagePreview(data.profile_image_url);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load testimonial data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const getInitials = (name) => {
    if (!name) return 'LD';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Reviewer Name is required.';
    if (!formData.bio.trim()) return 'Bio / Role is required.';
    if (!formData.linkedin_url.trim()) return 'LinkedIn URL is required.';
    if (!formData.linkedin_url.includes('linkedin.com/')) return 'Please enter a valid LinkedIn URL.';
    if (!formData.content.trim()) return 'Post Content is required.';
    return null;
  };

  const handleSubmit = async (e, forceStatus = null) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      let finalImageUrl = formData.profile_image_url;

      if (imageFile) {
        finalImageUrl = await testimonialService.uploadProfileImage(imageFile);
      }

      const submitData = {
        ...formData,
        profile_image_url: finalImageUrl,
        status: forceStatus || formData.status,
        display_order: parseInt(formData.display_order, 10)
      };

      if (isEditing) {
        await testimonialService.updateTestimonial(id, submitData);
      } else {
        await testimonialService.createTestimonial(submitData);
      }

      navigate('/admin/testimonials');
    } catch (err) {
      console.error(err);
      setError('Failed to save testimonial. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      
      {/* LEFT COLUMN: FORM */}
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/admin/testimonials" style={{ color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </Link>
          <h2 style={{ margin: 0 }}>{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
        </div>

        {error && <div className="admin-error-alert">{error}</div>}

        <form onSubmit={(e) => handleSubmit(e)} style={{ background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-input-group">
              <label>Reviewer Name *</label>
              <input type="text" className="admin-input" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Guttikonda Charitha" />
            </div>

            <div className="admin-input-group">
              <label>Short Bio / Role *</label>
              <input type="text" className="admin-input" name="bio" value={formData.bio} onChange={handleChange} placeholder="e.g. Machine Learning Intern" />
            </div>
          </div>

          <div className="admin-input-group">
            <label>LinkedIn Post URL *</label>
            <input type="url" className="admin-input" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://www.linkedin.com/posts/..." />
            <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'block' }}>Paste the LinkedIn post URL. This will be used for the LinkedIn button on the testimonial card.</span>
          </div>

          <div className="admin-input-group">
            <label>Profile Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={24} color="#9ca3af" />
                </div>
              )}
              <label style={{ cursor: 'pointer', background: '#f3f4f6', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 500 }}>
                <Upload size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Upload Image
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <div className="admin-input-group">
            <label>Category (Optional)</label>
            <input type="text" className="admin-input" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Internship Experience" />
          </div>

          <div className="admin-input-group">
            <label>Tags (Optional)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {formData.tags.map(tag => (
                <span key={tag} style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#ef4444' }}><X size={12} /></button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" className="admin-input" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag..." onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)} />
              <button type="button" onClick={handleAddTag} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '0 16px', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
            </div>
          </div>

          <div className="admin-input-group">
            <label>Post Content *</label>
            <textarea className="admin-input" name="content" value={formData.content} onChange={handleChange} placeholder="Enter the LinkedIn post text here..." style={{ minHeight: '150px', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-input-group">
              <label>Display Order</label>
              <input type="number" className="admin-input" name="display_order" value={formData.display_order} onChange={handleChange} />
            </div>

            <div className="admin-input-group">
              <label>Status</label>
              <select className="admin-input" name="status" value={formData.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '24px', paddingTop: '24px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <Link to="/admin/testimonials" style={{ padding: '10px 20px', textDecoration: 'none', color: '#4b5563', fontWeight: 500 }}>Cancel</Link>
            <button type="button" onClick={(e) => handleSubmit(e, 'draft')} className="admin-btn-primary" style={{ background: '#f3f4f6', color: '#111827', width: 'auto' }} disabled={loading}>
              Save as Draft
            </button>
            <button type="submit" onClick={(e) => handleSubmit(e, 'published')} className="admin-btn-primary" style={{ width: 'auto' }} disabled={loading}>
              {loading ? 'Saving...' : 'Publish'}
            </button>
          </div>

        </form>
      </div>

      {/* RIGHT COLUMN: PREVIEW */}
      <div style={{ flex: '1 1 350px', position: 'sticky', top: '24px', alignSelf: 'flex-start' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#4b5563' }}>Live Preview</h3>
        <div style={{ background: '#fdf2f8', padding: '32px', borderRadius: '16px', display: 'flex', justifyContent: 'center' }}>
          
          <div className={styles.testimonialCard} style={{ width: '380px', margin: 0, cursor: 'default', transform: 'none', transition: 'none' }}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>
                {imagePreview ? (
                  <img src={imagePreview} alt={formData.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  getInitials(formData.name)
                )}
              </div>
              <div className={styles.headerText}>
                <div className={styles.learnerName}>{formData.name || 'Reviewer Name'}</div>
                <div className={styles.learnerRole}>{formData.bio || 'Reviewer Role'}</div>
              </div>
              <a href={formData.linkedin_url || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                <svg className={styles.linkedinIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>

            <div className={styles.category}>{formData.category || 'CATEGORY'}</div>
            
            <div className={styles.postContent}>
              {formData.content || 'Post content will appear here...'}
              
              {formData.tags && formData.tags.length > 0 && (
                <div className={styles.tagsContainer}>
                  {formData.tags.map(tag => (
                    <span key={tag} className={styles.tagPill}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
