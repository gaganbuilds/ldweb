import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Briefcase, Play, Square, Archive, Globe } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, closed: 0, expired: 0, applications: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          job_categories(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const jobsData = data || [];
      setJobs(jobsData);
      
      // Calculate stats
      const newStats = {
        total: jobsData.length,
        published: jobsData.filter(j => j.status === 'published').length,
        drafts: jobsData.filter(j => j.status === 'draft').length,
        closed: jobsData.filter(j => j.status === 'closed').length,
        expired: jobsData.filter(j => j.status === 'expired').length,
        applications: 0 // Mocking 0 for now until job_applications are populated
      };
      
      try {
        const { count } = await supabase
          .from('job_applications')
          .select('*', { count: 'exact', head: true });
        newStats.applications = count || 0;
      } catch (e) {
        // Table might not exist yet
      }
      
      setStats(newStats);
      
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) throw error;
        setJobs(jobs.filter(j => j.id !== id));
      } catch (err) {
        alert('Failed to delete job.');
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const payload = { status: newStatus };
      if (newStatus === 'published') payload.published_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('jobs')
        .update(payload)
        .eq('id', id);
        
      if (error) throw error;
      setJobs(jobs.map(j => j.id === id ? { ...j, ...payload } : j));
    } catch (err) {
      alert(`Failed to mark as ${newStatus}.`);
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          j.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Job Management</h1>
          <p className="admin-page-subtitle">Create and manage job listings</p>
        </div>
        <button className="admin-btn-primary" onClick={() => navigate('/admin/jobs/new')}>
          <Plus size={18} />
          Create Job
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="admin-card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#0f172a' }}>{stats.total}</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Total Jobs</p>
        </div>
        <div className="admin-card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#16a34a' }}>{stats.published}</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Published</p>
        </div>
        <div className="admin-card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#eab308' }}>{stats.drafts}</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Drafts</p>
        </div>
        <div className="admin-card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#64748b' }}>{stats.closed}</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Closed</p>
        </div>
        <div className="admin-card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#f43f5e' }}>{stats.expired}</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Expired</p>
        </div>
        <div className="admin-card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#3b82f6' }}>{stats.applications}</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Applications</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-toolbar" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div className="admin-search" style={{ flex: 1, minWidth: '250px' }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="admin-select" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="closed">Closed</option>
            <option value="expired">Expired</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-loading">Loading jobs...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Applications</th>
                  <th>Posted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No jobs found.</td>
                  </tr>
                ) : (
                  filteredJobs.map(job => (
                    <tr key={job.id}>
                      <td>
                        <strong>{job.title}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{job.company_name} &bull; {job.employment_type}</div>
                      </td>
                      <td>{job.job_categories?.name || '-'}</td>
                      <td>{job.location || '-'}</td>
                      <td>
                        <span className={`admin-badge ${
                          job.status === 'published' ? 'success' : 
                          job.status === 'draft' ? 'warning' : 
                          job.status === 'closed' ? 'error' : 'default'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td>0</td>
                      <td>{job.published_at ? new Date(job.published_at).toLocaleDateString() : '-'}</td>
                      <td>
                        <div className="admin-table-actions">
                          <button 
                            className="admin-action-btn edit" 
                            title="Edit"
                            onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                          >
                            <Edit2 size={16} />
                          </button>
                          
                          {job.status === 'draft' && (
                            <button className="admin-action-btn success" title="Publish" onClick={() => handleUpdateStatus(job.id, 'published')}>
                              <Globe size={16} />
                            </button>
                          )}
                          
                          {job.status === 'published' && (
                            <button className="admin-action-btn warning" title="Close Job" onClick={() => handleUpdateStatus(job.id, 'closed')}>
                              <Square size={16} />
                            </button>
                          )}
                          
                          <button 
                            className="admin-action-btn delete" 
                            title="Delete"
                            onClick={() => handleDelete(job.id)}
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
