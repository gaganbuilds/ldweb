import React, { useState, useEffect } from 'react';
import { 
  X, Save, User, Mail, Phone, Building, 
  BookOpen, Clock, Edit3, Loader2, Calendar, Clipboard, Trash2, MonitorPlay
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin.css';

export default function InternshipApplicationDrawer({ id, onClose, onUpdated }) {
  const { user } = useAuth();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Edit form state
  const [editState, setEditState] = useState({
    status: '',
    priority: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      fetchApplication(id);
      setShowDeleteConfirm(false);
    } else {
      setApplication(null);
    }
  }, [id]);

  const fetchApplication = async (appId) => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('internship_applications')
        .select('*')
        .eq('id', appId)
        .single();
        
      if (error) throw error;
      if (data) {
        setApplication(data);
        setEditState({
          status: data.status || 'New',
          priority: data.priority || 'Normal',
          notes: data.admin_notes || ''
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditState(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const updates = {
        status: editState.status,
        priority: editState.priority,
        admin_notes: editState.notes,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('internship_applications')
        .update(updates)
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      setApplication(prev => ({ ...prev, ...updates }));
      setSuccess('Application updated successfully');
      
      if (onUpdated) onUpdated();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      const { error: deleteError } = await supabase
        .from('internship_applications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      if (onUpdated) onUpdated();
      onClose(); // Close the drawer after deleting
    } catch (err) {
      console.error(err);
      setError('Failed to delete application');
      setDeleting(false);
    }
  };

  if (!id) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-panel">
        
        {/* Drawer Header */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Application Details</h2>
            {!loading && application && (
              <p className="drawer-subtitle">Applied on {new Date(application.created_at).toLocaleString()}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="admin-btn admin-btn-primary" 
              onClick={handleSave}
              disabled={saving || loading || !application}
            >
              {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="admin-icon-btn" onClick={onClose} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="drawer-content">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 className="spinner" style={{ width: '32px', height: '32px', color: '#16a34a' }} />
            </div>
          ) : !application ? (
            <div className="admin-alert error">Application not found.</div>
          ) : (
            <>
              {error && <div className="admin-alert error" style={{ marginBottom: '20px' }}>{error}</div>}
              {success && <div className="admin-alert success" style={{ marginBottom: '20px', background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '6px' }}>{success}</div>}

              {/* Applicant Information */}
              <div className="admin-card" style={{ marginBottom: '24px' }}>
                <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <User size={16} /> Applicant Information
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px' }}>Full Name</label>
                  <div style={{ fontSize: '15px', fontWeight: '500' }}>{application.full_name}</div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} /> Email
                    </label>
                    <div style={{ fontSize: '14px' }}><a href={`mailto:${application.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{application.email}</a></div>
                  </div>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} /> Phone
                    </label>
                    <div style={{ fontSize: '14px' }}>
                      <a href={`tel:${application.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{application.phone}</a>
                      <a 
                        href={`https://wa.me/${application.phone.replace(/\D/g,'')}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ marginLeft: '8px', fontSize: '11px', background: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '4px', textDecoration: 'none' }}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building size={12} /> College / University
                    </label>
                    <div style={{ fontSize: '14px' }}>{application.college_university}</div>
                  </div>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> Current Year
                    </label>
                    <div style={{ fontSize: '14px' }}>{application.current_year}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={12} /> Course / Degree
                    </label>
                    <div style={{ fontSize: '14px' }}>{application.course_degree}</div>
                  </div>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MonitorPlay size={12} /> How Did You Hear?
                    </label>
                    <div style={{ fontSize: '14px' }}>
                      {application.how_heard}
                      {application.how_heard_other && ` (${application.how_heard_other})`}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BookOpen size={12} /> Preferred Domain
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#16a34a' }}>{application.preferred_domain}</div>
                </div>
              </div>

              {/* Management */}
              <div className="admin-card" style={{ marginBottom: '24px' }}>
                <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <Clipboard size={16} /> Application Management
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label" style={{ fontSize: '12px' }}>Status</label>
                    <select name="status" className="admin-input" value={editState.status} onChange={handleInputChange}>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '12px' }}>Priority</label>
                    <select name="priority" className="admin-input" value={editState.priority} onChange={handleInputChange}>
                      <option value="High">High</option>
                      <option value="Normal">Normal</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="admin-label" style={{ fontSize: '12px' }}>Admin Notes</label>
                  <textarea name="notes" className="admin-input" rows="4" placeholder="Add internal notes..." value={editState.notes} onChange={handleInputChange} />
                </div>
              </div>

              {/* Delete Action */}
              <div className="admin-card" style={{ border: '1px solid #fee2e2', background: '#fffcfc' }}>
                {showDeleteConfirm ? (
                  <div>
                    <h3 style={{ color: '#b91c1c', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>Delete Application?</h3>
                    <p style={{ fontSize: '13px', color: '#7f1d1d', marginBottom: '16px' }}>
                      Are you sure you want to permanently delete this application? This action cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        className="admin-btn admin-btn-secondary" 
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleting}
                      >
                        Cancel
                      </button>
                      <button 
                        className="admin-btn admin-btn-danger" 
                        style={{ background: '#ef4444', color: 'white', border: 'none' }}
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        {deleting ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="admin-btn admin-btn-secondary" 
                    style={{ width: '100%', color: '#ef4444', borderColor: '#fecaca', display: 'flex', justifyContent: 'center', gap: '8px' }}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 size={16} /> Delete Application
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        .drawer-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          z-index: 1000;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.2s ease-out;
        }
        .drawer-panel {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: 100%;
          max-width: 500px;
          background: #fff;
          z-index: 1001;
          box-shadow: -4px 0 24px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .drawer-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9fafb;
        }
        .drawer-title {
          font-size: 18px;
          font-weight: 600;
          color: #111;
          margin: 0 0 4px 0;
        }
        .drawer-subtitle {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }
        .drawer-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
