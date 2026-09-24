import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, PowerOff, Search, ArrowUpDown } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';

export default function JobCategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      let query = supabase.from('job_categories').select('*');
      const { data: cats, error: catsErr } = await query.order('display_order', { ascending: true });
      if (catsErr) throw catsErr;

      if (!cats || cats.length === 0) {
        setCategories([]);
        return;
      }

      // Fetch jobs to get counts
      const { data: jobs, error: jobsErr } = await supabase
        .from('jobs')
        .select('category_id')
        .eq('status', 'published')
        .eq('job_status', 'open');
        
      // Just ignore jobs error if table not populated yet
      let counts = {};
      if (!jobsErr && jobs) {
        jobs.forEach(j => {
          counts[j.category_id] = (counts[j.category_id] || 0) + 1;
        });
      }

      const merged = cats.map(c => ({
        ...c,
        jobCount: counts[c.id] || 0
      }));

      setCategories(merged);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Suppress error in UI if table doesn't exist yet (first run)
      if (error.code === '42P01') {
        alert("The job_categories table hasn't been created yet. Please run the SQL script.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const { error } = await supabase
        .from('job_categories')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setCategories(categories.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id, jobCount) => {
    if (jobCount > 0) {
      alert(`This category is currently assigned to ${jobCount} job listings. Please reassign those jobs before deleting this category.`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const { error } = await supabase.from('job_categories').delete().eq('id', id);
        if (error) throw error;
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesFeatured = featuredFilter === 'all' || 
                           (featuredFilter === 'featured' && c.is_featured) ||
                           (featuredFilter === 'not_featured' && !c.is_featured);
    return matchesSearch && matchesStatus && matchesFeatured;
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Job Categories</h1>
          <p className="admin-page-subtitle">Manage job categories for the Careers page</p>
        </div>
        <button className="admin-btn-primary" onClick={() => navigate('/admin/job-categories/new')}>
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-toolbar" style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div className="admin-search" style={{ flex: 1, minWidth: '250px' }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="admin-select" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select 
            className="admin-select" 
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
          >
            <option value="all">All Featured</option>
            <option value="featured">Featured Only</option>
            <option value="not_featured">Not Featured</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-loading">Loading categories...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Open Positions</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Order <ArrowUpDown size={14} style={{ display: 'inline', marginLeft: 4 }}/></th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>No categories found.</td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td><strong>{category.name}</strong></td>
                      <td style={{ color: '#64748b' }}>{category.slug}</td>
                      <td>
                        <span style={{ 
                          display: 'inline-block', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          background: category.jobCount > 0 ? '#dcfce7' : '#f1f5f9',
                          color: category.jobCount > 0 ? '#166534' : '#475569',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {category.jobCount}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${category.status === 'active' ? 'success' : 'warning'}`}>
                          {category.status}
                        </span>
                      </td>
                      <td>
                        {category.is_featured ? (
                          <span style={{ color: '#eab308', fontWeight: 'bold' }}>Yes</span>
                        ) : 'No'}
                      </td>
                      <td>{category.display_order}</td>
                      <td>{new Date(category.updated_at).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-table-actions">
                          <button 
                            className="admin-action-btn edit" 
                            title="Edit"
                            onClick={() => navigate(`/admin/job-categories/${category.id}/edit`)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className={`admin-action-btn ${category.status === 'active' ? 'warning' : 'success'}`} 
                            title={category.status === 'active' ? 'Disable' : 'Enable'}
                            onClick={() => handleToggleStatus(category.id, category.status)}
                          >
                            {category.status === 'active' ? <PowerOff size={16} /> : <Power size={16} />}
                          </button>
                          <button 
                            className="admin-action-btn delete" 
                            title="Delete"
                            onClick={() => handleDelete(category.id, category.jobCount)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
