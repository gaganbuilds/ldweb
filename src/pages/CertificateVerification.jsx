import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { certificateService } from '../admin/services/certificateService';

export default function CertificateVerification() {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [result, setResult] = useState(null); // 'valid', 'revoked', 'not_found', 'error'
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certificateNumber.trim()) return;

    setLoading(true);
    setResult(null);
    setCertificateData(null);

    try {
      const cleanNumber = certificateNumber.trim();
      const { data, error } = await certificateService.verifyCertificate(cleanNumber);

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('single row')) {
          setResult('not_found');
        } else {
          setResult('error');
        }
      } else if (data) {
        if (data.status === 'valid') {
          setResult('valid');
        } else {
          setResult('revoked');
        }
        setCertificateData(data);
      } else {
        setResult('not_found');
      }
    } catch (err) {
      setResult('error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div style={{ minHeight: '80vh', backgroundColor: '#f9fafb', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
            Verify Your Certificate
          </h1>
          <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.5' }}>
            Enter your certificate number to verify the authenticity of a LearnDepth certificate.
          </p>
        </div>

        {/* Verification Form */}
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', marginBottom: '32px' }}>
          <form onSubmit={handleVerify}>
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="certNumber" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Certificate Number
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 'y-0 left-0', paddingLeft: '12px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <Search size={20} color="#9ca3af" />
                </div>
                <input
                  id="certNumber"
                  type="text"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  placeholder="LD-INT-2026-000001"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !certificateNumber.trim()}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading || !certificateNumber.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !certificateNumber.trim() ? 0.7 : 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? <Loader2 className="spinner" size={20} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>
        </div>

        {/* Results Area */}
        {result === 'valid' && certificateData && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
            <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#166534', marginBottom: '8px' }}>
              Certificate Verified
            </h2>
            <p style={{ color: '#15803d', marginBottom: '24px', fontSize: '15px' }}>
              This certificate has been successfully verified as an authentic LearnDepth Academy certificate.
            </p>
            
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', textAlign: 'left', border: '1px solid #dcfce7' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Name</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{certificateData.recipient_name}</div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Certificate</div>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>{certificateData.certificate_title}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Category</div>
                  <div style={{ fontSize: '15px', color: '#374151' }}>{certificateData.category?.name || 'Internship'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Status</div>
                  <div style={{ display: 'inline-block', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: '600' }}>VALID</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Certificate Number</div>
                  <div style={{ fontSize: '15px', color: '#374151' }}>{certificateData.certificate_number}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Issued Date</div>
                  <div style={{ fontSize: '15px', color: '#374151' }}>{formatDate(certificateData.issued_date)}</div>
                </div>
              </div>

              {certificateData.start_date && certificateData.end_date && (
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Internship Period</div>
                  <div style={{ fontSize: '15px', color: '#374151' }}>
                    {formatDate(certificateData.start_date)} – {formatDate(certificateData.end_date)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {result === 'revoked' && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#991b1b', marginBottom: '8px' }}>
              Certificate Revoked
            </h2>
            <p style={{ color: '#b91c1c', marginBottom: '24px', fontSize: '15px' }}>
              This certificate is no longer considered valid by LearnDepth Academy.
            </p>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px', display: 'inline-block', border: '1px solid #fee2e2' }}>
              <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Certificate Number</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{certificateData?.certificate_number || certificateNumber}</div>
            </div>
          </div>
        )}

        {result === 'not_found' && (
          <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
            <XCircle size={48} color="#6b7280" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
              Certificate Not Found
            </h2>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>
              We could not find a certificate matching the number entered.<br/>
              Please check the certificate number and try again.
            </p>
          </div>
        )}

        {result === 'error' && (
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#d97706" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>
              Verification Error
            </h2>
            <p style={{ color: '#b45309', fontSize: '15px' }}>
              There was an error connecting to the verification service. Please try again later.
            </p>
          </div>
        )}

      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
