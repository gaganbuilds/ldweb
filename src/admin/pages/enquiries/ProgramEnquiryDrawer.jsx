import React, { useState, useEffect } from 'react';
import { 
  X, Save, User, Mail, Phone, Building, 
  BookOpen, MessageSquare, Clock, Edit3, Loader2, Calendar, Clipboard
} from 'lucide-react';
import { programEnquiryService } from '../../services/programEnquiryService';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin.css';

export default function ProgramEnquiryDrawer({ id, onClose, onUpdated }) {
  const { user } = useAuth();
  
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Edit form state
  const [editState, setEditState] = useState({
    lead_status: '',
    priority: '',
    assigned_to: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      fetchEnquiry(id);
    } else {
      setEnquiry(null);
    }
  }, [id]);

  const fetchEnquiry = async (enquiryId) => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await programEnquiryService.getEnquiryById(enquiryId);
      if (error) throw error;
      if (data) {
        setEnquiry(data);
        setEditState({
          lead_status: data.lead_status || 'New',
          priority: data.priority || 'Normal',
          assigned_to: data.assigned_to || '',
          notes: data.notes || ''
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load enquiry details');
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
      const changes = [];
      if (enquiry.lead_status !== editState.lead_status) changes.push(`Status changed from ${enquiry.lead_status} to ${editState.lead_status}`);
      if (enquiry.priority !== editState.priority) changes.push(`Priority changed from ${enquiry.priority} to ${editState.priority}`);
      
      const newActivity = changes.length > 0 ? {
        action: 'Update',
        description: changes.join(', '),
        user: user?.email || 'Admin'
      } : null;

      const updates = {
        lead_status: editState.lead_status,
        priority: editState.priority,
        assigned_to: editState.assigned_to,
        notes: editState.notes
      };

      const { data, error: updateError } = await programEnquiryService.updateEnquiry(id, updates, newActivity);
      
      if (updateError) throw updateError;
      
      setEnquiry(data);
      setSuccess('Enquiry updated successfully');
      
      if (onUpdated) onUpdated();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to update enquiry');
    } finally {
      setSaving(false);
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
            <h2 className="drawer-title">Program Enquiry Details</h2>
            {!loading && enquiry && (
              <p className="drawer-subtitle">Submitted on {new Date(enquiry.created_at).toLocaleString()}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="admin-btn admin-btn-primary" 
              onClick={handleSave}
              disabled={saving || loading || !enquiry}
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
          ) : !enquiry ? (
            <div className="admin-alert error">Enquiry not found.</div>
          ) : (
            <>
              {error && <div className="admin-alert error" style={{ marginBottom: '20px' }}>{error}</div>}
              {success && <div className="admin-alert success" style={{ marginBottom: '20px', background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '6px' }}>{success}</div>}

              {/* Lead Information */}
              <div className="admin-card" style={{ marginBottom: '24px' }}>
                <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <User size={16} /> Personal Details
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px' }}>Full Name</label>
                    <div style={{ fontSize: '15px', fontWeight: '500' }}>{enquiry.full_name}</div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} /> Email
                    </label>
                    <div style={{ fontSize: '14px' }}><a href={`mailto:${enquiry.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{enquiry.email}</a></div>
                  </div>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} /> Phone
                    </label>
                    <div style={{ fontSize: '14px' }}><a href={`tel:${enquiry.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{enquiry.phone}</a></div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', margin: '16px 0' }}></div>
                
                <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <BookOpen size={16} /> Education
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={12} /> Qualification
                    </label>
                    <div style={{ fontSize: '14px' }}>{enquiry.qualification}</div>
                  </div>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building size={12} /> College
                    </label>
                    <div style={{ fontSize: '14px' }}>{enquiry.college || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> Graduation Year
                    </label>
                    <div style={{ fontSize: '14px' }}>{enquiry.graduation_year || 'N/A'}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', margin: '16px 0' }}></div>

                <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <Clipboard size={16} /> Program & Preferences
                </h3>
                <div style={{ marginBottom: '16px' }}>
                  <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px' }}>Program</label>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#16a34a' }}>{enquiry.program_name}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px' }}>Learning Preference</label>
                    <div style={{ fontSize: '14px' }}>{enquiry.learning_preference || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px' }}>Preferred Batch</label>
                    <div style={{ fontSize: '14px' }}>{enquiry.preferred_batch || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px' }}>Current Status</label>
                    <div style={{ fontSize: '14px' }}>{enquiry.current_status || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px' }}>Enquiry Reason</label>
                    <div style={{ fontSize: '14px' }}>{enquiry.enquiry_reason || 'N/A'}</div>
                  </div>
                </div>

                {enquiry.message && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <label className="admin-label" style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <MessageSquare size={12} /> Message
                    </label>
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.5' }}>{enquiry.message}</div>
                  </div>
                )}
              </div>

              {/* Management */}
              <div className="admin-card" style={{ marginBottom: '24px' }}>
                <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <Clipboard size={16} /> Lead Management
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label" style={{ fontSize: '12px' }}>Status</label>
                    <select name="lead_status" className="admin-input" value={editState.lead_status} onChange={handleInputChange}>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Converted">Converted</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Closed">Closed</option>
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

                <div style={{ marginBottom: '16px' }}>
                  <label className="admin-label" style={{ fontSize: '12px' }}>Assigned To</label>
                  <input type="text" name="assigned_to" className="admin-input" placeholder="e.g., Jane Doe" value={editState.assigned_to} onChange={handleInputChange} />
                </div>

                <div>
                  <label className="admin-label" style={{ fontSize: '12px' }}>Internal Notes</label>
                  <textarea name="notes" className="admin-input" rows="4" placeholder="Add notes..." value={editState.notes} onChange={handleInputChange} />
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="admin-card">
                <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <Clock size={16} /> Activity History
                </h3>
                
                <div className="activity-timeline" style={{ marginTop: '16px' }}>
                  <div className="timeline-item" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div className="timeline-icon" style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '14px', color: '#111' }}>Enquiry Received</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                        {new Date(enquiry.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {enquiry.activity_history && Array.isArray(enquiry.activity_history) && enquiry.activity_history.map((activity, idx) => (
                    <div key={idx} className="timeline-item" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                      <div className="timeline-icon" style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f3f4f6', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Edit3 size={14} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px', color: '#111' }}>{activity.description}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          Updated by {activity.user} on {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
          max-width: 550px;
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
        .timeline-item:not(:last-child) {
          position: relative;
        }
        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 13px;
          top: 28px;
          bottom: -12px;
          width: 2px;
          background-color: #e5e7eb;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
