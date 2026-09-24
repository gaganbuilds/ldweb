import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Eye, Inbox, PhoneCall, ThumbsUp, CalendarClock, 
  CheckCircle, RefreshCcw, Loader2, ArrowUp, ArrowDown
} from 'lucide-react';
import { programEnquiryService } from '../../services/programEnquiryService';
import ProgramEnquiryDrawer from './ProgramEnquiryDrawer';
import '../../styles/admin.css';

export default function ProgramEnquiryList() {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  
  // Pagination, Filters & Sorting
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState({ column: 'created_at', ascending: false });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    program: '',
    learning_preference: '',
    current_status: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, enquiriesRes] = await Promise.all([
        programEnquiryService.getDashboardStats(),
        programEnquiryService.getEnquiries(page, limit, filters, sort)
      ]);

      if (statsRes && !statsRes.error) {
        setStats(statsRes);
      }
      
      if (enquiriesRes && !enquiriesRes.error) {
        setEnquiries(enquiriesRes.data);
        setTotalCount(enquiriesRes.count);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, sort.column, sort.ascending, filters.status, filters.priority, filters.program, filters.learning_preference, filters.current_status]); 

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
      setSort({ column, ascending: true }); // Default new columns to ascending
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
      const { data } = await programEnquiryService.getEnquiries(1, 10000, filters, sort);
      if (!data || data.length === 0) {
        alert("No data to export.");
        return;
      }

      const headers = ['ID', 'Date', 'Full Name', 'Email', 'Phone', 'Qualification', 'College', 'Graduation Year', 'Program', 'Learning Preference', 'Preferred Batch', 'Current Status', 'Enquiry Reason', 'Message', 'Lead Status', 'Priority', 'Assigned To', 'Source'];
      const rows = data.map(eq => [
        eq.id,
        new Date(eq.created_at).toLocaleDateString(),
        `"${eq.full_name}"`,
        eq.email,
        eq.phone,
        `"${eq.qualification || ''}"`,
        `"${eq.college || ''}"`,
        `"${eq.graduation_year || ''}"`,
        `"${eq.program_name || ''}"`,
        `"${eq.learning_preference || ''}"`,
        `"${eq.preferred_batch || ''}"`,
        `"${eq.current_status || ''}"`,
        `"${eq.enquiry_reason || ''}"`,
        `"${eq.message || ''}"`,
        eq.lead_status,
        eq.priority,
        eq.assigned_to || '',
        eq.source || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `program_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'badge-new';
      case 'Contacted': return 'badge-contacted';
      case 'Interested': return 'badge-interested';
      case 'Follow-up': return 'badge-followup';
      case 'Converted': return 'badge-converted';
      case 'Closed': case 'Not Interested': return 'badge-closed';
      default: return 'badge-default';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge-high';
      case 'Normal': case 'Medium': return 'badge-medium';
      case 'Low': return 'badge-low';
      default: return 'badge-default';
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Program Enquiries</h1>
          <p className="admin-page-subtitle">Manage leads for courses and programs</p>
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
            <div className="admin-stat-label">Total</div>
            <div className="admin-stat-value">{stats?.total || 0}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><Inbox size={20} /></div>
          <div className="admin-stat-details">
            <div className="admin-stat-label">New</div>
            <div className="admin-stat-value">{stats?.new || 0}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><PhoneCall size={20} /></div>
          <div className="admin-stat-details">
            <div className="admin-stat-label">Contacted</div>
            <div className="admin-stat-value">{stats?.contacted || 0}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}><ThumbsUp size={20} /></div>
          <div className="admin-stat-details">
            <div className="admin-stat-label">Interested</div>
            <div className="admin-stat-value">{stats?.interested || 0}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#fce7f3', color: '#db2777' }}><CalendarClock size={20} /></div>
          <div className="admin-stat-details">
            <div className="admin-stat-label">Follow-up</div>
            <div className="admin-stat-value">{stats?.followup || 0}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}><CheckCircle size={20} /></div>
          <div className="admin-stat-details">
            <div className="admin-stat-label">Converted</div>
            <div className="admin-stat-value">{stats?.converted || 0}</div>
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

          <select name="status" className="admin-input" value={filters.status} onChange={handleFilterChange} style={{ width: '150px' }}>
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Converted">Converted</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Closed">Closed</option>
          </select>

          <select name="priority" className="admin-input" value={filters.priority} onChange={handleFilterChange} style={{ width: '150px' }}>
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
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
                <th onClick={() => handleSort('program_name')} className="sortable-th" style={{ width: '18%' }}>
                  Program <SortIcon column="program_name" />
                </th>
                <th style={{ width: '15%' }}>Learning Pref.</th>
                <th onClick={() => handleSort('lead_status')} className="sortable-th" style={{ width: '10%' }}>
                  Status <SortIcon column="lead_status" />
                </th>
                <th onClick={() => handleSort('priority')} className="sortable-th" style={{ width: '8%' }}>
                  Priority <SortIcon column="priority" />
                </th>
                <th style={{ width: '5%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                    <Loader2 className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '10px', color: '#6b7280' }}>Loading enquiries...</p>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="admin-empty-state">
                    No enquiries found matching your filters.
                  </td>
                </tr>
              ) : (
                enquiries.map((eq) => (
                  <tr key={eq.id}>
                    <td>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(eq.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500', color: '#111' }}>{eq.full_name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{eq.email}</div>
                    </td>
                    <td><span style={{ fontSize: '13px' }}>{eq.phone}</span></td>
                    <td>
                      <div className="truncate-text" style={{ fontWeight: '500', color: '#16a34a' }} title={eq.program_name}>{eq.program_name}</div>
                    </td>
                    <td>
                      <span className="truncate-text" title={eq.learning_preference}>{eq.learning_preference}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${getStatusBadgeClass(eq.lead_status)}`}>{eq.lead_status}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${getPriorityBadgeClass(eq.priority)}`}>{eq.priority}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => setSelectedEnquiryId(eq.id)} className="admin-action-btn" title="View Details">
                        <Eye size={18} />
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
            <span>Showing {Math.min((page - 1) * limit + 1, totalCount)} to {Math.min(page * limit, totalCount)} of {totalCount} leads</span>
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
      
      {selectedEnquiryId && (
        <ProgramEnquiryDrawer 
          id={selectedEnquiryId} 
          onClose={() => setSelectedEnquiryId(null)}
          onUpdated={() => fetchData()}
        />
      )}

      <style>{`
        .badge-new { background: #dbeafe; color: #1e40af; }
        .badge-contacted { background: #fef3c7; color: #b45309; }
        .badge-interested { background: #e0e7ff; color: #4338ca; }
        .badge-followup { background: #fce7f3; color: #be185d; }
        .badge-converted { background: #dcfce7; color: #15803d; }
        .badge-closed { background: #f3f4f6; color: #374151; }
        
        .badge-high { background: #fee2e2; color: #b91c1c; border-left: 3px solid #ef4444; }
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
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
