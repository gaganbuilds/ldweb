import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Settings, Image as ImageIcon, Send } from 'lucide-react';
import { blogService } from '../../services/blogService';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../services/supabase';
import TipTapEditor from '../../components/TipTapEditor';
import '../../styles/admin.css';

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [activeTab, setActiveTab] = useState('content'); // content, settings, seo, publish

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    author_id: '',
    featured_image_url: '',
    thumbnail_image_url: '',
    status: 'draft',
    seo_title: '',
    meta_description: '',
    focus_keyword: '',
    canonical_url: ''
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const [metadata, setMetadata] = useState({
    categories: [],
    authors: [],
    tags: []
  });

  const [loading, setLoading] = useState(false);
  const [autosaveMsg, setAutosaveMsg] = useState('');

  useEffect(() => {
    loadMetadata();
    if (isEditing) {
      loadBlog();
    }
  }, [id]);

  // Auto-save logic
  useEffect(() => {
    if (!isEditing || !formData.title || !formData.content) return;
    
    const timeoutId = setTimeout(async () => {
      try {
        setAutosaveMsg('Autosaving...');
        await blogService.updateBlog(id, formData, selectedTags);
        setAutosaveMsg('Saved automatically at ' + new Date().toLocaleTimeString());
        setTimeout(() => setAutosaveMsg(''), 3000);
      } catch (err) {
        console.error('Autosave failed:', err);
        setAutosaveMsg('Autosave failed');
      }
    }, 10000); // Autosave 10s after last change

    return () => clearTimeout(timeoutId);
  }, [formData, selectedTags, isEditing, id]);

  const loadMetadata = async () => {
    try {
      const [categories, authors, tags] = await Promise.all([
        cmsService.getCategories(),
        cmsService.getAuthors(),
        cmsService.getTags()
      ]);
      setMetadata({ categories, authors, tags });
    } catch (err) {
      console.error('Error loading metadata', err);
    }
  };

  const loadBlog = async () => {
    try {
      setLoading(true);
      const blog = await blogService.getBlogById(id);
      if (blog) {
        const { category, author, blog_tag_relations, ...rest } = blog;
        setFormData({
          ...rest,
          category_id: rest.category_id || '',
          author_id: rest.author_id || ''
        });
        
        if (blog_tag_relations) {
          setSelectedTags(blog_tag_relations.map(rel => rel.tag.id));
        }
      } else {
        alert('Blog not found.');
        navigate('/admin/blogs');
      }
    } catch (error) {
      console.error('Error loading blog:', error);
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
      if (name === 'title' && !isEditing) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleEditorChange = (html) => {
    setFormData(prev => ({ ...prev, content: html }));
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleImageUpload = async (e, fieldName) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `featured-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, [fieldName]: data.publicUrl }));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Error uploading image.');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await blogService.updateBlog(id, formData, selectedTags);
      } else {
        await blogService.createBlog(formData, selectedTags);
      }
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page blog-editor-page">
      <div className="admin-header">
        <div className="admin-header-title">
          <Link to="/admin/blogs" className="admin-back-btn">
            <ArrowLeft size={20} />
          </Link>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              {isEditing ? 'Edit Article' : 'Write New Article'}
              <span className={`admin-badge ${formData.status === 'published' ? 'success' : 'warning'}`}>
                {formData.status}
              </span>
            </h1>
            {autosaveMsg && <span style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>{autosaveMsg}</span>}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))} 
            className="admin-btn neutral"
          >
            Save Draft
          </button>
          <button 
            onClick={() => {
              setFormData(prev => ({ ...prev, status: 'published' }));
              handleSubmit();
            }} 
            disabled={loading} 
            className="admin-btn primary"
          >
            <Send size={18} />
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}><FileText size={16} /> Content</button>
        <button className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={16} /> Meta & Categories</button>
        <button className={`admin-tab ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}><ImageIcon size={16} /> Media</button>
        <button className={`admin-tab ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}><Search size={16} /> SEO & Social</button>
      </div>

      <div className="admin-card" style={{ padding: '32px', minHeight: '600px' }}>
        
        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="tab-pane">
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Article Title..." 
              style={{ fontSize: '32px', fontWeight: 'bold', width: '100%', border: 'none', borderBottom: '2px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px', outline: 'none' }}
            />
            
            <TipTapEditor content={formData.content} onChange={handleEditorChange} />
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="tab-pane">
            <div className="admin-form-group">
              <label>URL Slug</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label>Excerpt</label>
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} className="admin-textarea" rows="3" placeholder="Brief summary for blog listing page" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="admin-form-group">
                <label>Category</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} className="admin-input">
                  <option value="">Select Category</option>
                  {metadata.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label>Author</label>
                <select name="author_id" value={formData.author_id} onChange={handleChange} className="admin-input">
                  <option value="">Select Author</option>
                  {metadata.authors.map(author => (
                    <option key={author.id} value={author.id}>{author.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Tags</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {metadata.tags.map(tag => (
                  <label key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: selectedTags.includes(tag.id) ? '#e0e7ff' : '#f3f4f6', padding: '4px 12px', borderRadius: '16px', cursor: 'pointer', color: selectedTags.includes(tag.id) ? '#4f46e5' : '#4b5563', transition: 'all 0.2s' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedTags.includes(tag.id)} 
                      onChange={() => handleTagToggle(tag.id)}
                      style={{ display: 'none' }}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="tab-pane">
            <div className="admin-form-group">
              <label>Featured Image (Hero)</label>
              <div className="admin-image-preview" style={{ maxWidth: '600px', marginBottom: '12px' }}>
                {formData.featured_image_url ? (
                  <>
                    <img src={formData.featured_image_url} alt="Featured" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '' }))} className="admin-remove-image">Remove</button>
                  </>
                ) : (
                  <div style={{ padding: '40px', border: '2px dashed #d1d5db', borderRadius: '8px', textAlign: 'center', background: '#f9fafb' }}>
                    <p style={{ color: '#6b7280', marginBottom: '16px' }}>Upload a hero image for the blog post.</p>
                    <input type="file" onChange={(e) => handleImageUpload(e, 'featured_image_url')} accept="image/*" />
                  </div>
                )}
              </div>
            </div>

            <div className="admin-form-group">
              <label>Thumbnail Image (Optional, for listings)</label>
              <div className="admin-image-preview" style={{ maxWidth: '300px', marginBottom: '12px' }}>
                {formData.thumbnail_image_url ? (
                  <>
                    <img src={formData.thumbnail_image_url} alt="Thumbnail" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, thumbnail_image_url: '' }))} className="admin-remove-image">Remove</button>
                  </>
                ) : (
                  <div style={{ padding: '40px', border: '2px dashed #d1d5db', borderRadius: '8px', textAlign: 'center', background: '#f9fafb' }}>
                    <input type="file" onChange={(e) => handleImageUpload(e, 'thumbnail_image_url')} accept="image/*" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === 'seo' && (
          <div className="tab-pane">
            <div className="admin-form-group">
              <label>SEO Title (Defaults to Article Title if blank)</label>
              <input type="text" name="seo_title" value={formData.seo_title} onChange={handleChange} className="admin-input" />
            </div>
            
            <div className="admin-form-group">
              <label>Meta Description</label>
              <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} className="admin-textarea" rows="3" />
            </div>

            <div className="admin-form-group">
              <label>Focus Keyword</label>
              <input type="text" name="focus_keyword" value={formData.focus_keyword} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label>Canonical URL</label>
              <input type="text" name="canonical_url" value={formData.canonical_url} onChange={handleChange} className="admin-input" placeholder="https://learndepth.com/blog/..." />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
