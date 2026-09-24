import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, Mail, Trash2, Save } from 'lucide-react';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Editable fields
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  
  // Storage URLs
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            title,
            slug,
            company_name,
            job_categories (name)
          )
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      setApp(data);
      setStatus(data.status || 'New');
      setAdminNotes(data.admin_notes || '');
      
      // Get signed URL for resume (since it's in a private bucket ideally)
      if (data.resume_path) {
        // If it's a public bucket for now, just get public URL
        const { data: urlData } = supabase.storage
          .from('job-resumes')
          .getPublicUrl(data.resume_path);
          
        setResumeUrl(urlData.publicUrl);
      }
      
    } catch (error) {
      console.error('Error fetching application:', error);
      alert('Failed to load application details.');
      navigate('/admin/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('job_applications')
        .update({ 
          status, 
          admin_notes: adminNotes 
        })
        .eq('id', id);
        
      if (error) throw error;
      alert('Application updated successfully.');
    } catch (err) {
      console.error('Save error', err);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) return;
    try {
      const { error } = await supabase.from('job_applications').delete().eq('id', id);
      if (error) throw error;
      navigate('/admin/applications');
    } catch (err) {
      console.error('Delete error', err);
      alert('Failed to delete application.');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading application details...</div>;
  if (!app) return <div style={{ padding: '20px' }}>Application not found.</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin/applications" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '12px', fontSize: '14px' }}>
            <ArrowLeft size={16} /> Back to Applications
          </Link>
          <h1>{app.candidate_name}</h1>
          <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {app.application_reference} • Applied on {new Date(app.created_at).toLocaleString()}
          </div>
        </div>
        <div className="admin-actions">
          <button onClick={handleDelete} className="admin-btn" style={{ background: 'white', border: '1px solid #ef4444', color: '#ef4444' }}>
            <Trash2 size={16} /> Delete
          </button>
          <button onClick={handleSave} className="admin-btn admin-btn-primary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Main Content Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="admin-card">
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Email</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {app.email} 
                  <a href={`mailto:${app.email}`} title="Send Email" style={{ color: '#16a34a' }}><Mail size={14} /></a>
                </div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Phone</div>
                <div>{app.phone}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>WhatsApp</div>
                <div>{app.whatsapp || '-'}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Location</div>
                <div>{[app.current_city, app.state, app.country].filter(Boolean).join(', ') || '-'}</div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>Professional & Education</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Current Status</div>
                <div style={{ fontWeight: 500 }}>{app.current_status}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Experience</div>
                <div style={{ fontWeight: 500 }}>{app.experience_level} ({app.experience_years || '0'} years)</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Current Role</div>
                <div>{app.present_role || '-'}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Organization</div>
                <div>{app.organization || '-'}</div>
              </div>
              
              <div style={{ gridColumn: '1 / -1', height: '1px', background: '#e2e8f0', margin: '8px 0' }}></div>
              
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Highest Qualification</div>
                <div style={{ fontWeight: 500 }}>{app.qualification}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Degree / Specialization</div>
                <div>{[app.degree, app.specialization].filter(Boolean).join(' - ') || '-'}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>College / University</div>
                <div>{app.college || '-'}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Graduation Year</div>
                <div>{app.graduation_year || '-'}</div>
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>Skills & Experience</h3>
            <div>
              <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>Key Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {app.skills && app.skills.length > 0 ? (
                  app.skills.map((skill, i) => (
                    <span key={i} style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', border: '1px solid #e2e8f0' }}>{skill}</span>
                  ))
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>No skills provided</span>
                )}
              </div>
              
              <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>Experience Summary</div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                {app.experience_summary || 'No summary provided.'}
              </p>
            </div>
          </div>
          
          {app.cover_letter && (
            <div className="admin-card">
              <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>Cover Letter</h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {app.cover_letter}
              </p>
            </div>
          )}

        </div>
        
        {/* Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="admin-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px' }}>Application Action</h3>
            <div className="admin-form-group">
              <label>Update Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="admin-select"
                style={{ background: 'white' }}
              >
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Internal Notes (Not visible to candidate)</label>
              <textarea 
                value={adminNotes} 
                onChange={(e) => setAdminNotes(e.target.value)}
                className="admin-input" 
                style={{ height: '120px', background: 'white' }}
                placeholder="Add private notes about this candidate..."
              />
            </div>
            <button onClick={handleSave} className="admin-btn admin-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={saving}>
              {saving ? 'Saving...' : 'Update Application'}
            </button>
          </div>

          <div className="admin-card">
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px', fontSize: '16px' }}>Applied Job</h3>
            <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>{app.jobs?.title}</div>
            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>{app.jobs?.company_name}</div>
            <Link to={`/careers/jobs/${app.jobs?.slug}`} target="_blank" className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              View Job Posting <ExternalLink size={14} />
            </Link>
          </div>
          
          <div className="admin-card">
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px', fontSize: '16px' }}>Resume & Links</h3>
            
            {resumeUrl ? (
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="admin-btn admin-btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '16px' }}>
                <Download size={16} /> View Resume
              </a>
            ) : (
              <div style={{ padding: '12px', background: '#fef2f2', color: '#b91c1c', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
                No resume file attached
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {app.linkedin_url && (
                <a href={app.linkedin_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', textDecoration: 'none', fontSize: '14px' }}>
                  <ExternalLink size={14} /> LinkedIn Profile
                </a>
              )}
              {app.github_url && (
                <a href={app.github_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', textDecoration: 'none', fontSize: '14px' }}>
                  <ExternalLink size={14} /> GitHub Profile
                </a>
              )}
              {app.portfolio_url && (
                <a href={app.portfolio_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', textDecoration: 'none', fontSize: '14px' }}>
                  <ExternalLink size={14} /> Portfolio / Website
                </a>
              )}
              {app.other_url && (
                <a href={app.other_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>
                  <ExternalLink size={14} /> Other Link
                </a>
              )}
              {!app.linkedin_url && !app.github_url && !app.portfolio_url && !app.other_url && (
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>No links provided.</div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
