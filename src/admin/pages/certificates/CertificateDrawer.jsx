import React, { useState, useEffect } from 'react';
import { X, Calendar, Edit, Trash2, Ban, ShieldCheck, Loader2 } from 'lucide-react';
import { certificateService } from '../../services/certificateService';

export default function CertificateDrawer({ id, onClose, onUpdated, onEdit }) {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const fetchCertificate = async () => {
    setLoading(true);
    try {
      const { data } = await certificateService.getCertificateById(id);
      setCertificate(data);
    } catch (error) {
      console.error("Failed to fetch certificate", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus === 'revoked' ? 'revoke' : 'restore'} this certificate?`)) return;
    
    setActionLoading(true);
    try {
      await certificateService.updateCertificate(id, { status: newStatus });
      fetchCertificate();
      if (onUpdated) onUpdated();
    } catch (error) {
      alert("Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete Certificate?\n\nThis certificate will be permanently removed and can no longer be verified.")) return;
    
    setActionLoading(true);
    try {
      await certificateService.deleteCertificate(id);
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      alert("Failed to delete certificate.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (!id) return null;

  return (
    <>
      <div className="admin-overlay open" onClick={onClose}></div>
      <div className="admin-drawer open" style={{ width: '450px', padding: 0, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>Certificate Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 className="spinner" size={24} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : certificate ? (
            <div>
              {/* Status Banner */}
              <div style={{ 
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: certificate.status === 'valid' ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${certificate.status === 'valid' ? '#bbf7d0' : '#fecaca'}`,
                color: certificate.status === 'valid' ? '#166534' : '#991b1b'
              }}>
                {certificate.status === 'valid' ? <ShieldCheck size={18} /> : <Ban size={18} />}
                <span style={{ fontWeight: '600' }}>
                  {certificate.status === 'valid' ? 'Valid Certificate' : 'Revoked Certificate'}
                </span>
              </div>

              {/* Key Info */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Recipient Name</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{certificate.recipient_name}</div>
              </div>

              {certificate.recipient_email && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Recipient Email</div>
                  <div style={{ fontSize: '15px', color: '#111827' }}>{certificate.recipient_email}</div>
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Certificate Title</div>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>{certificate.certificate_title}</div>
              </div>

              {/* Grid details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Certificate Number</div>
                  <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{certificate.certificate_number}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Category</div>
                  <div style={{ fontSize: '14px', color: '#111827' }}>{certificate.category?.name || '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Issued Date</div>
                  <div style={{ fontSize: '14px', color: '#111827' }}>{formatDate(certificate.issued_date)}</div>
                </div>
              </div>

              {/* Internship Period */}
              {(certificate.start_date || certificate.end_date) && (
                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> Internship Period
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Start Date</div>
                      <div style={{ fontSize: '14px', color: '#111827' }}>{formatDate(certificate.start_date)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>End Date</div>
                      <div style={{ fontSize: '14px', color: '#111827' }}>{formatDate(certificate.end_date)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {certificate.description && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Description</div>
                  <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{certificate.description}</div>
                </div>
              )}

              {/* Timestamps */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Created At</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{new Date(certificate.created_at).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Updated At</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{new Date(certificate.updated_at).toLocaleString()}</div>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>Certificate not found.</div>
          )}
        </div>

        {/* Footer Actions */}
        {certificate && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', backgroundColor: 'white', display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => onEdit(certificate)}
                className="admin-btn admin-btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                disabled={actionLoading}
              >
                <Edit size={16} /> Edit
              </button>
              {certificate.status === 'valid' ? (
                <button 
                  onClick={() => handleStatusChange('revoked')}
                  className="admin-btn admin-btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b91c1c' }}
                  disabled={actionLoading}
                >
                  <Ban size={16} /> Revoke
                </button>
              ) : (
                <button 
                  onClick={() => handleStatusChange('valid')}
                  className="admin-btn admin-btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534' }}
                  disabled={actionLoading}
                >
                  <ShieldCheck size={16} /> Restore
                </button>
              )}
            </div>
            
            <button 
              onClick={handleDelete}
              className="admin-btn admin-btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', borderColor: '#fca5a5' }}
              disabled={actionLoading}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
}
