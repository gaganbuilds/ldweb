import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, FileText, Search, Eye, Filter } from 'lucide-react';
import { blogService } from '../../services/blogService';
import '../../styles/admin.css';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState('all'); // all, published, draft, scheduled
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogService.getBlogs();
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert('Failed to load blogs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await blogService.deleteBlog(id);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'published').length,
    drafts: blogs.filter(b => b.status === 'draft').length,
    scheduled: blogs.filter(b => b.status === 'scheduled').length,
    views: blogs.reduce((acc, curr) => acc + (curr.views || 0), 0)
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-title">
          <FileText size={24} color="#4f46e5" />
          <h1>Blog Management</h1>
        </div>
        <Link to="/admin/blogs/new" className="admin-btn primary">
          <Plus size={18} />
          Write Article
        </Link>
      </div>

      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div className="admin-stat-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Blogs</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>{stats.total}</div>
        </div>
        <div className="admin-stat-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Published</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginTop: '8px' }}>{stats.published}</div>
        </div>
        <div className="admin-stat-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Drafts</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginTop: '8px' }}>{stats.drafts}</div>
        </div>
        <div className="admin-stat-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Scheduled</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginTop: '8px' }}>{stats.scheduled}</div>
        </div>
        <div className="admin-stat-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Views</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6', marginTop: '8px' }}>{stats.views}</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-filters" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af' }} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <div style={{ width: '200px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="#6b7280" />
            <select className="admin-input" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading articles...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="admin-empty">
            <FileText size={48} color="#9ca3af" />
            <h3>No articles found</h3>
            <p>Try adjusting your filters or write a new article.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <strong>{blog.title}</strong>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        /{blog.slug}
                      </div>
                    </td>
                    <td>{blog.category ? blog.category.name : 'Uncategorized'}</td>
                    <td>{blog.author ? blog.author.name : 'No Author'}</td>
                    <td>
                      <span className={`admin-badge ${blog.status === 'published' ? 'success' : blog.status === 'scheduled' ? 'neutral' : 'warning'}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={14} color="#6b7280" /> {blog.views}
                      </div>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link to={`/admin/blogs/${blog.id}/edit`} className="admin-icon-btn edit">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(blog.id)} className="admin-icon-btn delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
