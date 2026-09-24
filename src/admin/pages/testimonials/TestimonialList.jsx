import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink, MessageSquare } from 'lucide-react';
import { testimonialService } from '../../services/testimonialService';

export default function TestimonialList() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAdminTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the testimonial from ${name}?`)) {
      try {
        await testimonialService.deleteTestimonial(id);
        setTestimonials(testimonials.filter(t => t.id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete testimonial.');
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return 'LD';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading testimonials...</div>;

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Testimonials</h2>
          <p>Manage learner experiences and LinkedIn posts displayed on the website.</p>
        </div>
        <Link to="/admin/testimonials/new" className="admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: 'auto' }}>
          <Plus size={18} /> Add Testimonial
        </Link>
      </div>

      {error && <div className="admin-error-alert">{error}</div>}

      {testimonials.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <MessageSquare size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>No testimonials yet</h3>
          <p style={{ margin: '0 0 24px 0', color: '#6b7280' }}>Add your first learner experience to display on the website.</p>
          <Link to="/admin/testimonials/new" className="admin-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'auto' }}>
            <Plus size={18} /> Add Testimonial
          </Link>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>Profile</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>LinkedIn</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>Order</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px' }}>
                    {t.profile_image_url ? (
                      <img src={t.profile_image_url} alt={t.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fce8ef', color: '#e6235b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                        {getInitials(t.name)}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px', fontWeight: 500, color: '#111827' }}>{t.name}</td>
                  <td style={{ padding: '16px', color: '#4b5563', fontSize: '14px' }}>
                    {t.bio}
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{t.category}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <a href={t.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '14px' }}>
                      View Post <ExternalLink size={14} />
                    </a>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '9999px', 
                      fontSize: '12px', 
                      fontWeight: 500,
                      backgroundColor: t.status === 'published' ? '#dcfce7' : '#f3f4f6',
                      color: t.status === 'published' ? '#166534' : '#4b5563'
                    }}>
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#4b5563', fontSize: '14px' }}>{t.display_order}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <Link to={`/admin/testimonials/${t.id}/edit`} style={{ padding: '6px', color: '#4b5563', background: '#f3f4f6', borderRadius: '6px' }}>
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDelete(t.id, t.name)} style={{ padding: '6px', color: '#ef4444', background: '#fef2f2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
