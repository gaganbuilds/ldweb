import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, Upload, Loader2, ArrowUp, ArrowDown, Eye, ShieldCheck, Ban, FileText, CheckCircle } from 'lucide-react';
import { certificateService } from '../../services/certificateService';
import CertificateDrawer from './CertificateDrawer';
import CertificateFormModal from './CertificateFormModal';
import CertificateImportModal from './CertificateImportModal';
import '../../styles/admin.css';

export default function CertificateList() {
  const [certificates, setCertificates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  // UI State
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState({ column: 'created_at', ascending: false });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    categoryId: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, limit, sort.column, sort.ascending, filters.status, filters.categoryId]);

  const fetchCategories = async () => {
    const { data } = await certificateService.getCategories();
    if (data) setCategories(data);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, count } = await certificateService.getCertificates(page, limit, filters, sort);
      if (data) {
        setCertificates(data);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch certificates', error);
    } finally {
      setLoading(false);
    }
  };

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

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCSV = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const { data } = await certificateService.getCertificates(1, 10000, filters, sort);
      if (!data || data.length === 0) {
        alert("No data to export.");
        return;
      }

      const headers = ['Certificate Number', 'Recipient Name', 'Recipient Email', 'Certificate Title', 'Category', 'Issued Date', 'Start Date', 'End Date', 'Status', 'Description'];
      const rows = data.map(c => [
        c.certificate_number,
        `"${c.recipient_name}"`,
        `"${c.recipient_email || ''}"`,
        `"${c.certificate_title}"`,
        `"${c.category?.name || ''}"`,
        c.issued_date,
        c.start_date || '',
        c.end_date || '',
        c.status,
        `"${c.description || ''}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `certificates_export_${new Date().toISOString().split('T')[0]}.csv`);
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

  const openEdit = (cert) => {
    setEditData(cert);
    setIsFormOpen(true);
    setSelectedCertificateId(null);
  };

  const SortIcon = ({ column }) => {
    if (sort.column !== column) return <span style={{ opacity: 0.3, marginLeft: '4px' }}>↕</span>;
    return sort.ascending ? <ArrowUp size={12} style={{ marginLeft: '4px' }} /> : <ArrowDown size={12} style={{ marginLeft: '4px' }} />;
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="admin-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#1f2937', color: 'white', padding: '12px 20px', borderRadius: '8px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <CheckCircle size={18} color="#4ade80" /> {toastMessage}
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Certificate Management</h1>
          <p className="admin-page-subtitle">Manage, import, and track issued certificates</p>
        </div>
        <div className="admin-header-actions" style={{ display: 'flex', gap: '12px' }}>
          <button className="admin-btn admin-btn-secondary" onClick={() => setIsImportOpen(true)}>
            <Upload size={16} /> Import CSV
          </button>
          <button className="admin-btn admin-btn-secondary" onClick={handleExportCSV} disabled={exporting}>
            {exporting ? <Loader2 size={16} className="spinner" /> : <Download size={16} />} 
            {exporting ? 'Exporting...' : 'Export'}
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => { setEditData(null); setIsFormOpen(true); }}>
            <Plus size={16} /> Add Certificate
          </button>
        </div>
      </div>

      <div className="admin-card">
        {/* Filters */}
        <div className="admin-table-filters" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: '1', minWidth: '250px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af' }} />
              <input 
                type="text" 
                className="admin-input" 
                placeholder="Search certificate number, name, title..." 
                style={{ paddingLeft: '36px', width: '100%' }}
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <button type="submit" className="admin-btn admin-btn-primary">Search</button>
          </form>

          <select name="categoryId" className="admin-input" value={filters.categoryId} onChange={handleFilterChange} style={{ width: '180px' }}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select name="status" className="admin-input" value={filters.status} onChange={handleFilterChange} style={{ width: '150px' }}>
            <option value="">All Statuses</option>
            <option value="valid">Valid</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>

        {/* Table */}
        <div className="admin-table-container" style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('certificate_number')} className="sortable-th" style={{ width: '20%' }}>
                  Certificate No. <SortIcon column="certificate_number" />
                </th>
                <th onClick={() => handleSort('recipient_name')} className="sortable-th" style={{ width: '22%' }}>
                  Recipient Name <SortIcon column="recipient_name" />
                </th>
                <th onClick={() => handleSort('certificate_title')} className="sortable-th" style={{ width: '22%' }}>
                  Certificate Title <SortIcon column="certificate_title" />
                </th>
                <th style={{ width: '12%' }}>Category</th>
                <th onClick={() => handleSort('issued_date')} className="sortable-th" style={{ width: '12%' }}>
                  Issued <SortIcon column="issued_date" />
                </th>
                <th onClick={() => handleSort('status')} className="sortable-th" style={{ width: '8%' }}>
                  Status <SortIcon column="status" />
                </th>
                <th style={{ width: '4%', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <Loader2 className="spinner" size={24} style={{ margin: '0 auto 12px', color: '#6b7280', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: '#6b7280' }}>Loading certificates...</p>
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <FileText size={48} color="#d1d5db" style={{ margin: '0 auto' }} />
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>No certificates found</p>
                    <p style={{ marginBottom: '24px' }}>Get started by adding a new certificate or importing from CSV.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                      <button className="admin-btn admin-btn-secondary" onClick={() => setIsImportOpen(true)}>Import CSV</button>
                      <button className="admin-btn admin-btn-primary" onClick={() => { setEditData(null); setIsFormOpen(true); }}>Add Certificate</button>
                    </div>
                  </td>
                </tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert.id} onClick={() => setSelectedCertificateId(cert.id)} style={{ cursor: 'pointer' }} className="admin-table-row-hover">
                    <td>
                      <div style={{ fontWeight: '500', color: '#111827', fontFamily: 'monospace', fontSize: '13px' }}>
                        {cert.certificate_number}
                      </div>
                    </td>
                    <td><div style={{ fontWeight: '500' }}>{cert.recipient_name}</div></td>
                    <td><div style={{ color: '#4b5563', fontSize: '13px' }}>{cert.certificate_title}</div></td>
                    <td>
                      <span style={{ backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: '#4b5563' }}>
                        {cert.category?.name || '-'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(cert.issued_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td>
                      {cert.status === 'valid' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                          <ShieldCheck size={12} /> Valid
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                          <Ban size={12} /> Revoked
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="admin-action-btn" title="View Details">
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
        {!loading && totalCount > 0 && (
          <div className="admin-pagination-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '0 8px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Showing {Math.min((page - 1) * limit + 1, totalCount)} to {Math.min(page * limit, totalCount)} of {totalCount} records</span>
              <span style={{ color: '#d1d5db' }}>|</span>
              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="admin-input" style={{ width: 'auto', padding: '4px 8px', height: 'auto', fontSize: '13px' }}>
                <option value="15">15 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
                <option value="100">100 / page</option>
              </select>
            </div>
            
            {totalPages > 1 && (
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
        )}
      </div>

      {/* Modals & Drawer */}
      <CertificateFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editData}
        onSuccess={(msg) => { showToast(msg); fetchData(); }}
      />
      
      <CertificateImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        categoryId={categories.find(c => c.slug === 'internship')?.id}
        onSuccess={() => { showToast("Certificates imported successfully."); fetchData(); }}
      />
      
      <CertificateDrawer 
        id={selectedCertificateId} 
        onClose={() => setSelectedCertificateId(null)}
        onUpdated={fetchData}
        onEdit={openEdit}
      />

      <style>{`
        .sortable-th { cursor: pointer; user-select: none; transition: background-color 0.2s; }
        .sortable-th:hover { background-color: #f9fafb; }
        .admin-table-row-hover:hover { background-color: #f9fafb; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
