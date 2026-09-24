import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, User, Mail, Phone, MapPin, 
  BookOpen, Building, MessageSquare, Clock, Edit3, Loader2, Calendar, Clipboard
} from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin.css';

export default function InternshipEnquiryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Edit form state
  const [editState, setEditState] = useState({
    status: '',
    priority: '',
    assigned_to: '',
    follow_up_date: '',
    notes: ''
  });

  useEffect(() => {
    fetchEnquiry();
  }, [id]);

  const fetchEnquiry = async () => {
    try {
      const { data, error } = await enquiryService.getEnquiryById(id);
      if (error) throw error;
      if (data) {
        setEnquiry(data);
        setEditState({
          status: data.status || 'New',
          priority: data.priority || 'Medium',
          assigned_to: data.assigned_to || '',
          follow_up_date: data.follow_up_date ? new Date(data.follow_up_date).toISOString().slice(0, 16) : '', // Format for datetime-local
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
      // Determine what changed for the activity log
      const changes = [];
      if (enquiry.status !== editState.status) changes.push(`Status changed from ${enquiry.status} to ${editState.status}`);
      if (enquiry.priority !== editState.priority) changes.push(`Priority changed from ${enquiry.priority} to ${editState.priority}`);
      
      const newActivity = changes.length > 0 ? {
        action: 'Update',
        description: changes.join(', '),
        user: user?.email || 'Admin'
      } : null;

      const updates = {
        status: editState.status,
        priority: editState.priority,
        assigned_to: editState.assigned_to,
        follow_up_date: editState.follow_up_date ? new Date(editState.follow_up_date).toISOString() : null,
        notes: editState.notes
      };

      const { data, error: updateError } = await enquiryService.updateEnquiry(id, updates, newActivity);
      
      if (updateError) throw updateError;
      
      setEnquiry(data);
      setSuccess('Enquiry updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error(err);
      setError('Failed to update enquiry');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="spinner" style={{ animation: 'spin 1s linear infinite', width: '40px', height: '40px', color: '#16a34a' }} />
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="admin-page">
        <div className="admin-alert error">Enquiry not found.</div>
        <Link to="/admin/internship-enquiries" className="admin-btn admin-btn-secondary" style={{ marginTop: '20px', display: 'inline-block' }}>
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/admin/internship-enquiries" className="admin-icon-btn" title="Back">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="admin-page-title">Enquiry Details</h1>
            <p className="admin-page-subtitle">Submitted on {new Date(enquiry.created_at).toLocaleString()}</p>
          </div>
        </div>
        <div className="admin-header-actions">
          <button 
            className="admin-btn admin-btn-primary" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div className="admin-alert error" style={{ marginBottom: '20px' }}>{error}</div>}
      {success && <div className="admin-alert success" style={{ marginBottom: '20px', background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '6px' }}>{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* Top Two Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* Lead Information */}
          <div className="admin-card">
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} /> Lead Information
            </h2>
            <div className="admin-form-group" style={{ marginBottom: '16px' }}>
              <label className="admin-label" style={{ color: '#6b7280' }}>Full Name</label>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{enquiry.full_name}</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} /> Email
                </label>
                <div><a href={`mailto:${enquiry.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{enquiry.email}</a></div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} /> Phone
                </label>
                <div><a href={`tel:${enquiry.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{enquiry.phone}</a></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={14} /> College / Institution
                </label>
                <div>{enquiry.college}</div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> Current Year
                </label>
                <div>{enquiry.current_year}</div>
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: '16px' }}>
              <label className="admin-label" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} /> Interested Internship
              </label>
              <div style={{ fontWeight: '500', color: '#16a34a' }}>{enquiry.interested_internship}</div>
            </div>

            {enquiry.message && (
              <div className="admin-form-group" style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label className="admin-label" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={14} /> Message from applicant
                </label>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{enquiry.message}</div>
              </div>
            )}
            
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#9ca3af' }}>
              Source: {enquiry.source_page}
            </div>
          </div>

          {/* Management Panel */}
          <div className="admin-card">
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clipboard size={18} /> Lead Management
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Status</label>
                <select 
                  name="status" 
                  className="admin-input" 
                  value={editState.status} 
                  onChange={handleInputChange}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Converted">Converted</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Priority</label>
                <select 
                  name="priority" 
                  className="admin-input" 
                  value={editState.priority} 
                  onChange={handleInputChange}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: '16px' }}>
              <label className="admin-label">Assigned To (Name/Email)</label>
              <input 
                type="text" 
                name="assigned_to" 
                className="admin-input" 
                placeholder="e.g., Jane Doe"
                value={editState.assigned_to} 
                onChange={handleInputChange}
              />
            </div>

            <div className="admin-form-group" style={{ marginBottom: '16px' }}>
              <label className="admin-label">Follow-up Date & Time</label>
              <input 
                type="datetime-local" 
                name="follow_up_date" 
                className="admin-input" 
                value={editState.follow_up_date} 
                onChange={handleInputChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Internal Notes</label>
              <textarea 
                name="notes" 
                className="admin-input" 
                rows="5"
                placeholder="Add notes about this lead..."
                value={editState.notes} 
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} /> Activity History
          </h2>
          
          <div className="activity-timeline" style={{ marginTop: '20px' }}>
            {/* Initial Submission Event */}
            <div className="timeline-item" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <div className="timeline-icon" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={16} />
              </div>
              <div className="timeline-content">
                <div style={{ fontWeight: '500', color: '#111' }}>Enquiry Received</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                  Submitted on {new Date(enquiry.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Render history from JSONB */}
            {enquiry.activity_history && Array.isArray(enquiry.activity_history) && enquiry.activity_history.map((activity, idx) => (
              <div key={idx} className="timeline-item" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div className="timeline-icon" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f4f6', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Edit3 size={16} />
                </div>
                <div className="timeline-content">
                  <div style={{ fontWeight: '500', color: '#111' }}>{activity.description}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                    Updated by {activity.user} on {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .timeline-item:not(:last-child) {
          position: relative;
        }
        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 15px;
          top: 32px;
          bottom: -20px;
          width: 2px;
          background-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
}
