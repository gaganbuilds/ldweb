import React, { useState, useEffect } from 'react';
import { Tag as TagIcon, Trash2, Plus } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import '../../styles/admin.css';

export default function TagList() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newTagName, setNewTagName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await cmsService.getTags();
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    
    try {
      setCreating(true);
      const slug = newTagName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      await cmsService.createTag({ name: newTagName.trim(), slug });
      setNewTagName('');
      fetchTags();
    } catch (error) {
      console.error('Error creating tag:', error);
      alert('Error creating tag. Slug might already exist.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tag?')) return;
    try {
      await cmsService.deleteTag(id);
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-title">
          <TagIcon size={24} color="#4f46e5" />
          <h1>Tags Management</h1>
        </div>
      </div>

      <div className="admin-content-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="admin-side-col">
          <div className="admin-card">
            <h3>Add New Tag</h3>
            <form onSubmit={handleCreate}>
              <div className="admin-form-group">
                <label>Tag Name</label>
                <input 
                  type="text" 
                  value={newTagName} 
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="admin-input" 
                  placeholder="e.g. Machine Learning"
                  required
                />
              </div>
              <button type="submit" disabled={creating} className="admin-btn primary" style={{ width: '100%' }}>
                <Plus size={18} />
                {creating ? 'Adding...' : 'Add Tag'}
              </button>
            </form>
          </div>
        </div>

        <div className="admin-main-col">
          <div className="admin-card">
            {loading ? (
              <div className="admin-loading">Loading tags...</div>
            ) : tags.length === 0 ? (
              <div className="admin-empty">
                <p>No tags created yet.</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map((tag) => (
                      <tr key={tag.id}>
                        <td><strong>{tag.name}</strong></td>
                        <td><code>{tag.slug}</code></td>
                        <td>
                          <button onClick={() => handleDelete(tag.id)} className="admin-icon-btn delete">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
