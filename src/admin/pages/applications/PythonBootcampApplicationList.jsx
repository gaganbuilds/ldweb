import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Eye, Inbox, Trash2, 
  RefreshCcw, Loader2, ArrowUp, ArrowDown, FileText, CheckCircle, Clock
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import PythonBootcampApplicationDrawer from './PythonBootcampApplicationDrawer';
import '../../styles/admin.css';

export default function PythonBootcampApplicationList() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Pagination, Filters & Sorting
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState({ column: 'created_at', ascending: false });
  const [filters, setFilters] = useState({
    search: '',
    application_status: '',
    payment_status: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const { data: allData, error: statsError } = await supabase
        .from('python_bootcamp_applications')
        .select('application_status, payment_status');
        
      if (!statsError && allData) {
        setStats({
          total: allData.length,
          new: allData.filter(a => a.application_status === 'New').length,
          contacted: allData.filter(a => a.application_status === 'Contacted').length,
          registered: allData.filter(a => a.application_status === 'Registered').length,
          paid: allData.filter(a => a.payment_status === 'Paid').length,
        });
      }

      // Fetch paginated & filtered data
      let query = supabase.from('python_bootcamp_applications').select('*', { count: 'exact' });

      if (filters.application_status) query = query.eq('application_status', filters.application_status);
      if (filters.payment_status) query = query.eq('payment_status', filters.payment_status);
      
      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,college_university.ilike.%${filters.search}%`);
      }

      // Sorting
      query = query.order(sort.column, { ascending: sort.ascending });

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;
      
      setApplications(data || []);
      if (count !== null) setTotalCount(count);

    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, sort.column, sort.ascending, filters.application_status, filters.payment_status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSort = (column) => {
    if (sort.column === column) {
      setSort({ column, ascending: !sort.ascending });
    } else {
      setSort({ column, ascending: true });
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const { error } = await supabase.from('python_bootcamp_applications').delete().eq('id', id);
      if (error) throw error;
      
      if (selectedAppId === id) {
        setSelectedAppId(null);
      }
      
      setShowDeleteConfirm(null);
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to delete application', error);
      alert('Failed to delete application.');
    } finally {
      setDeleting(false);
    }
  };

  const SortIcon = ({ column }) => {
    if (sort.column !== column) return <span style={{ opacity: 0.3, marginLeft: '4px' }}>↕</span>;
    return sort.ascending ? <ArrowUp size={12} style={{ marginLeft: '4px' }} /> : <ArrowDown size={12} style={{ marginLeft: '4px' }} />;
  };

  const handleExportCSV = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      let query = supabase.from('python_bootcamp_applications').select('*').order(sort.column, { ascending: sort.ascending });
      if (filters.application_status) query = query.eq('application_status', filters.application_status);
      if (filters.payment_status) query = query.eq('payment_status', filters.payment_status);
      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,college_university.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        alert("No data to export.");
        return;
      }

      const headers = ['ID', 'Date', 'Full Name', 'Email', 'Phone', 'College', 'Year', 'Skill Level', 'Goal', 'App Status', 'Payment Status', 'Notes'];
      const rows = data.map(app => [
        app.id,
        new Date(app.created_at).toLocaleDateString(),
        `"${(app.full_name || '').replace(/"/g, '""')}"`,
        `"${app.email}"`,
        app.phone,
        `"${(app.college_university || '').replace(/"/g, '""')}"`,
        `"${app.current_year}"`,
        `"${app.python_skill_level}"`,
        `"${app.primary_goal}"`,
        app.application_status,
        app.payment_status,
        `"${(app.admin_notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `python_bootcamp_applications_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export data.");
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'badge-new';
      case 'Contacted': return 'badge-contacted';
      case 'Interested': return 'badge-interested';
      case 'Registered': return 'badge-converted';
      case 'Closed': return 'badge-closed';
      default: return 'badge-default';
    }
  };

  const getPaymentBadgeClass = (status) => {
    switch (status) {
      case 'Not Started': return 'badge-default';
      case 'Pending': return 'badge-medium';
      case 'Paid': return 'badge-high'; // Using existing green styles? Actually high is red in existing. Let's define new ones.
      case 'Failed': case 'Refunded': return 'badge-closed';
      default: return 'badge-default';
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Python Bootcamp Applications</h1>
          <p className="admin-page-subtitle">Manage applications for the 30-Day Python Bootcamp.</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-secondary" onClick={handleExportCSV} disabled={exporting}>
            {exporting ? <Loader2 size={16} className="spinner" /> : <Download size={16} />} 
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button className="admin-btn admin-btn-secondary" onClick={fetchData} title="Refresh">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="admin-stats-grid" style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#f3f4f6', color: '#4b5563' }}><Inbox size={20} /></div>
          <div className="admin-stat-details">
            <div className="admin-stat-label">Total Applications</div>
            <div className="admin-stat-value">{stats?.total || 0}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><FileText size={20} /></div>
          <div className="admin-stat-details">
            <div className="admin-stat-label">New</div>
            <div className="admin-stat-value">{stats?.new || 0}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}><CheckCircle size={20} /></div>
          <div className="admin-stat-details">
            <div className="admin-stat-label">Registered</div>
            <div className="admin-stat-value">{stats?.registered || 0}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}><CheckCircle size={20} /></div>
          <div className="admin-stat-details">
            <div className="admin-stat-label">Verified Paid</div>
            <div className="admin-stat-value">{stats?.paid || 0}</div>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="admin-card">
        <div className="admin-table-filters" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: '1', minWidth: '250px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af' }} />
              <input 
                type="text" 
                className="admin-input" 
                placeholder="Search name, email, phone..." 
                style={{ paddingLeft: '36px', width: '100%' }}
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <button type="submit" className="admin-btn admin-btn-primary">Search</button>
          </form>

          <select name="application_status" className="admin-input" value={filters.application_status} onChange={handleFilterChange} style={{ width: '160px' }}>
            <option value="">All App Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="Registered">Registered</option>
            <option value="Closed">Closed</option>
          </select>

          <select name="payment_status" className="admin-input" value={filters.payment_status} onChange={handleFilterChange} style={{ width: '160px' }}>
            <option value="">All Payment Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid (Verified)</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        <div className="admin-table-container" style={{ overflowX: 'auto' }}>
          <table className="admin-table leads-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('created_at')} className="sortable-th" style={{ width: '12%' }}>
                  Date <SortIcon column="created_at" />
                </th>
                <th onClick={() => handleSort('full_name')} className="sortable-th" style={{ width: '22%' }}>
                  Name / Email <SortIcon column="full_name" />
                </th>
                <th style={{ width: '15%' }}>Phone</th>
                <th onClick={() => handleSort('college_university')} className="sortable-th" style={{ width: '18%' }}>
                  College / Year <SortIcon column="college_university" />
                </th>
                <th onClick={() => handleSort('application_status')} className="sortable-th" style={{ width: '12%' }}>
                  App Status <SortIcon column="application_status" />
                </th>
                <th onClick={() => handleSort('payment_status')} className="sortable-th" style={{ width: '12%' }}>
                  Payment Status <SortIcon column="payment_status" />
                </th>
                <th style={{ width: '9%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    <Loader2 className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '10px', color: '#6b7280' }}>Loading applications...</p>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="admin-empty-state">
                    No applications found matching your filters.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500', color: '#111' }}>{app.full_name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{app.email}</div>
                    </td>
                    <td><span style={{ fontSize: '13px' }}>{app.phone}</span></td>
                    <td>
                      <div className="truncate-text" title={app.college_university}>{app.college_university}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{app.current_year}</div>
                    </td>
                    <td>
                      <span className={`admin-badge ${getStatusBadgeClass(app.application_status)}`}>{app.application_status}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${getPaymentBadgeClass(app.payment_status)}`}>{app.payment_status}</span>
                    </td>
                    <td style={{ textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => setSelectedAppId(app.id)} className="admin-action-btn" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => setShowDeleteConfirm(app.id)} className="admin-action-btn" title="Delete" style={{ color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="admin-pagination-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '0 8px' }}>
          <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Showing {Math.min((page - 1) * limit + 1, totalCount || 1)} to {Math.min(page * limit, totalCount)} of {totalCount} applications</span>
            <span style={{ color: '#d1d5db' }}>|</span>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="admin-input" style={{ width: 'auto', padding: '4px 8px', height: 'auto', fontSize: '13px' }}>
              <option value="10">10 / page</option>
              <option value="15">15 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
            </select>
          </div>
          
          {!loading && totalPages > 1 && (
            <div className="admin-pagination">
              <button 
                className="admin-pagination-btn" 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="admin-pagination-info">Page {page} of {totalPages}</span>
              <button 
                className="admin-pagination-btn" 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      
      <PythonBootcampApplicationDrawer 
        id={selectedAppId} 
        onClose={() => setSelectedAppId(null)}
        onUpdated={() => fetchData()}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Delete Application?</h2>
            <p style={{ color: '#4b5563', marginBottom: '24px', fontSize: '14px' }}>
              Are you sure you want to permanently delete this bootcamp application? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="admin-btn admin-btn-secondary" 
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className="admin-btn admin-btn-danger" 
                style={{ background: '#ef4444', color: 'white', border: 'none' }}
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .badge-new { background: #dbeafe; color: #1e40af; }
        .badge-contacted { background: #fef3c7; color: #b45309; }
        .badge-interested { background: #e0e7ff; color: #4338ca; }
        .badge-converted { background: #dcfce7; color: #15803d; }
        .badge-closed { background: #f3f4f6; color: #374151; }
        
        .badge-high { background: #dcfce7; color: #15803d; border-left: 3px solid #16a34a; } /* Modified high to green */
        .badge-medium { background: #fef3c7; color: #b45309; border-left: 3px solid #f59e0b; }
        .badge-low { background: #f3f4f6; color: #4b5563; border-left: 3px solid #9ca3af; }
        
        .leads-table {
          table-layout: fixed;
          width: 100%;
          min-width: 900px;
        }
        .leads-table th {
          white-space: nowrap;
        }
        .sortable-th {
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s;
        }
        .sortable-th:hover {
          background-color: #f9fafb;
        }
        .truncate-text {
          font-size: 13px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }
        
        .admin-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .admin-modal {
          background: #fff;
          padding: 24px;
          border-radius: 8px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
