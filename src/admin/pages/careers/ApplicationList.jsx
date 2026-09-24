import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Link } from 'react-router-dom';
import { Eye, Search, Filter, Trash2, Download } from 'lucide-react';

export default function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJobId, setFilterJobId] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    review: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [filterJobId, filterStatus]);

  const fetchJobs = async () => {
    try {
      const { data } = await supabase.from('jobs').select('id, title, status');
      setJobs(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('job_applications')
        .select(`
          id,
          application_reference,
          candidate_name,
          email,
          phone,
          experience_years,
          status,
          created_at,
          jobs!inner(title, job_categories(name))
        `)
        .order('created_at', { ascending: false });

      if (filterJobId !== 'all') {
        query = query.eq('job_id', filterJobId);
      }
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setApplications(data || []);
      
      if (filterJobId === 'all' && filterStatus === 'all') {
        calculateStats(data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const newStats = {
      total: data.length,
      new: data.filter(a => a.status === 'New').length,
      review: data.filter(a => a.status === 'Under Review').length,
      shortlisted: data.filter(a => a.status === 'Shortlisted').length,
      interview: data.filter(a => a.status === 'Interview').length,
      selected: data.filter(a => a.status === 'Selected').length,
      rejected: data.filter(a => a.status === 'Rejected').length,
    };
    setStats(newStats);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      const { error } = await supabase.from('job_applications').delete().eq('id', id);
      if (error) throw error;
      setApplications(applications.filter(a => a.id !== id));
    } catch (err) {
      console.error('Delete error', err);
      alert('Failed to delete application.');
    }
  };

  const handleExportCSV = () => {
    if (applications.length === 0) return;
    
    const headers = ['ID', 'Date', 'Candidate', 'Email', 'Phone', 'Job', 'Category', 'Experience', 'Status'];
    const csvData = applications.map(app => [
      app.application_reference,
      new Date(app.created_at).toLocaleDateString(),
      `"${app.candidate_name}"`,
      app.email,
      app.phone,
      `"${app.jobs?.title || 'Unknown'}"`,
      `"${app.jobs?.job_categories?.name || 'Unknown'}"`,
      app.experience_years || '',
      app.status
    ]);
    
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filteredApps = applications.filter(app => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      app.candidate_name.toLowerCase().includes(searchLower) ||
      app.email.toLowerCase().includes(searchLower) ||
      (app.application_reference && app.application_reference.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Job Applications</h1>
        <button onClick={handleExportCSV} className="admin-btn admin-btn-secondary">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-title">Total Applications</div>
          <div className="admin-stat-value">{stats.total}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-title">New</div>
          <div className="admin-stat-value">{stats.new}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-title">Shortlisted</div>
          <div className="admin-stat-value">{stats.shortlisted}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-title">Selected</div>
          <div className="admin-stat-value">{stats.selected}</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-search">
            <Search size={18} className="admin-search-icon" />
            <input 
              type="text" 
              placeholder="Search candidate, email, ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>
          
          <div className="admin-filters">
            <Filter size={18} className="admin-filter-icon" />
            <select 
              value={filterJobId}
              onChange={(e) => setFilterJobId(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Jobs</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title} ({job.status})</option>
              ))}
            </select>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Candidate</th>
                  <th>Job</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No applications found.</td>
                  </tr>
                ) : (
                  filteredApps.map(app => (
                    <tr key={app.id}>
                      <td>{new Date(app.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{app.candidate_name}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>{app.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{app.jobs?.title}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>{app.jobs?.job_categories?.name}</div>
                      </td>
                      <td>{app.experience_years || '-'}</td>
                      <td>
                        <span className={`admin-badge ${app.status.toLowerCase().replace(' ', '-')}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link to={`/admin/applications/${app.id}`} className="admin-action-btn" title="View Details">
                            <Eye size={18} />
                          </Link>
                          <button className="admin-action-btn admin-delete-btn" onClick={() => handleDelete(app.id)} title="Delete">
                            <Trash2 size={18} />
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
