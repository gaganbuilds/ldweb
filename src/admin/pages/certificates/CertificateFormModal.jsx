import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { certificateService } from '../../services/certificateService';

export default function CertificateFormModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const [formData, setFormData] = useState({
    certificate_number: '',
    recipient_name: '',
    recipient_email: '',
    certificate_title: '',
    issued_date: '',
    start_date: '',
    end_date: '',
    status: 'valid',
    description: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (initialData) {
        setFormData({
          certificate_number: initialData.certificate_number || '',
          recipient_name: initialData.recipient_name || '',
          recipient_email: initialData.recipient_email || '',
          certificate_title: initialData.certificate_title || '',
          issued_date: initialData.issued_date ? initialData.issued_date.split('T')[0] : '',
          start_date: initialData.start_date ? initialData.start_date.split('T')[0] : '',
          end_date: initialData.end_date ? initialData.end_date.split('T')[0] : '',
          status: initialData.status || 'valid',
          description: initialData.description || ''
        });
        setSelectedCategoryId(initialData.category_id || '');
      } else {
        // Reset form for new addition, auto-generate a sample number
        setFormData({
          certificate_number: `LD-INT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
          recipient_name: '',
          recipient_email: '',
          certificate_title: '',
          issued_date: new Date().toISOString().split('T')[0],
          start_date: '',
          end_date: '',
          status: 'valid',
          description: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const fetchCategories = async () => {
    const { data } = await certificateService.getCategories();
    if (data) {
      setCategories(data);
      // For V1, we only have internship. Auto-select if available
      const internshipCat = data.find(c => c.slug === 'internship');
      if (internshipCat && !initialData) {
        setSelectedCategoryId(internshipCat.id);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.certificate_number) {
      return setError("Certificate number is required");
    }
    if (!formData.recipient_name) {
      return setError("Recipient name is required");
    }
    if (!formData.certificate_title) {
      return setError("Certificate title is required");
    }
    if (!formData.issued_date) {
      return setError("Issued date is required");
    }
    if (!formData.start_date) {
      return setError("Start date is required");
    }
    if (!formData.end_date) {
      return setError("End date is required");
    }
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      return setError("End date cannot be before start date");
    }
    if (!selectedCategoryId) {
      return setError("Category is required");
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        category_id: selectedCategoryId
      };

      let res;
      if (initialData) {
        res = await certificateService.updateCertificate(initialData.id, payload);
      } else {
        res = await certificateService.createCertificate(payload);
      }

      if (res.error) {
        setError(res.error.message || "Failed to save certificate");
      } else {
        onSuccess(initialData ? 'Certificate updated successfully' : 'Certificate created successfully');
        onClose();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="admin-modal-content" style={{ backgroundColor: 'white', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{initialData ? 'Edit Certificate' : 'Add Certificate'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', border: '1px solid #fca5a5' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Certificate Number *</label>
              <input type="text" name="certificate_number" value={formData.certificate_number} onChange={handleChange} className="admin-input" style={{ width: '100%' }} placeholder="e.g. LD-INT-2026-000001" required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Category *</label>
              <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="admin-input" style={{ width: '100%' }} required disabled>
                {/* V1 only supports Internship. Disabled to prevent changes */}
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Recipient Name *</label>
              <input type="text" name="recipient_name" value={formData.recipient_name} onChange={handleChange} className="admin-input" style={{ width: '100%' }} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Recipient Email (Optional)</label>
              <input type="email" name="recipient_email" value={formData.recipient_email} onChange={handleChange} className="admin-input" style={{ width: '100%' }} placeholder="For ID retrieval feature" />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Certificate Title *</label>
            <input type="text" name="certificate_title" value={formData.certificate_title} onChange={handleChange} className="admin-input" style={{ width: '100%' }} placeholder="e.g. Machine Learning Internship" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Issued Date *</label>
              <input type="date" name="issued_date" value={formData.issued_date} onChange={handleChange} className="admin-input" style={{ width: '100%' }} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Start Date *</label>
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="admin-input" style={{ width: '100%' }} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>End Date *</label>
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="admin-input" style={{ width: '100%' }} required />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="admin-input" style={{ width: '100%' }}>
              <option value="valid">Valid</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Description (Optional)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="admin-input" style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading && <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />}
              {initialData ? 'Update Certificate' : 'Save Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
