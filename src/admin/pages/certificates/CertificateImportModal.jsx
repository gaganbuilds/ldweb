import React, { useState } from 'react';
import { X, Upload, Download, CheckCircle, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { certificateService } from '../../services/certificateService';

export default function CertificateImportModal({ isOpen, onClose, onSuccess, categoryId }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState({ valid: [], invalid: [] });
  const [loading, setLoading] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  if (!isOpen) return null;

  const requiredColumns = [
    'certificate_number',
    'recipient_name',
    'recipient_email',
    'certificate_title',
    'issued_date',
    'start_date',
    'end_date',
    'status',
    'description'
  ];

  const parseCSVLine = (text) => {
    let result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (text[i] === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += text[i];
      }
    }
    result.push(cur.trim());
    return result;
  };

  const downloadSample = () => {
    const headers = requiredColumns.join(',');
    const sampleRows = [
      'LD-INT-2026-000001,Rahul Kumar,rahul@example.com,Machine Learning Internship,2026-10-07,2026-09-01,2026-09-30,valid,Successfully completed the Machine Learning Internship Program.',
      'LD-INT-2026-000002,Ananya Sharma,ananya@example.com,Web Development Internship,2026-10-07,2026-09-01,2026-09-30,valid,Successfully completed the Web Development Internship Program.'
    ];
    const csvContent = headers + '\n' + sampleRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'learndepth-internship-certificates-sample.csv';
    link.click();
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      alert("Please upload a valid CSV file.");
      return;
    }
    
    setFile(selectedFile);
    processCSV(selectedFile);
  };

  const processCSV = async (csvFile) => {
    setLoading(true);
    setStep(2); // Move to preview step
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        alert("The CSV file is empty or only contains headers.");
        setStep(1);
        setLoading(false);
        return;
      }

      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
      
      // Check required columns
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      if (missingColumns.length > 0) {
        alert(`Invalid CSV format. Missing columns: ${missingColumns.join(', ')}`);
        setStep(1);
        setLoading(false);
        return;
      }

      // Fetch existing certificate numbers to validate uniqueness
      const { data: existingCertificates } = await certificateService.getCertificates(1, 10000);
      const existingNumbers = new Set((existingCertificates || []).map(c => c.certificate_number));
      const seenNumbersInCsv = new Set();

      const valid = [];
      const invalid = [];

      for (let i = 1; i < lines.length; i++) {
        const rowText = lines[i];
        if (!rowText.trim()) continue;
        
        const rowData = parseCSVLine(rowText);
        const record = {};
        
        headers.forEach((header, index) => {
          record[header] = rowData[index] || '';
        });

        const rowNumber = i + 1;
        let rowError = null;

        // Validation
        if (!record.certificate_number) {
          rowError = "Certificate number is required";
        } else if (seenNumbersInCsv.has(record.certificate_number)) {
          rowError = "Duplicate certificate number inside CSV";
        } else if (existingNumbers.has(record.certificate_number)) {
          rowError = "Certificate number already exists in database";
        } else if (!record.recipient_name) {
          rowError = "Recipient name is required";
        } else if (!record.recipient_email) {
          rowError = "Recipient email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.recipient_email)) {
          rowError = "Invalid email format";
        } else if (!record.certificate_title) {
          rowError = "Certificate title is required";
        } else if (!record.issued_date) {
          rowError = "Issued date is required";
        } else if (!record.start_date) {
          rowError = "Start date is required";
        } else if (!record.end_date) {
          rowError = "End date is required";
        } else if (new Date(record.end_date) < new Date(record.start_date)) {
          rowError = "End date cannot be before start date";
        } else if (!['valid', 'revoked'].includes(record.status?.toLowerCase())) {
          rowError = "Status must be 'valid' or 'revoked'";
        }

        if (rowError) {
          invalid.push({ rowNumber, certificate_number: record.certificate_number || 'N/A', error: rowError });
        } else {
          seenNumbersInCsv.add(record.certificate_number);
          valid.push({
            certificate_number: record.certificate_number,
            recipient_name: record.recipient_name,
            recipient_email: record.recipient_email,
            certificate_title: record.certificate_title,
            category_id: categoryId,
            issued_date: record.issued_date,
            start_date: record.start_date,
            end_date: record.end_date,
            status: record.status.toLowerCase(),
            description: record.description || null
          });
        }
      }

      setParsedData({ valid, invalid });
      setLoading(false);
    };
    
    reader.onerror = () => {
      alert("Failed to read the file.");
      setStep(1);
      setLoading(false);
    };
    
    reader.readAsText(csvFile);
  };

  const handleImport = async () => {
    if (parsedData.valid.length === 0) return;
    
    setLoading(true);
    try {
      const { error } = await certificateService.bulkInsertCertificates(parsedData.valid);
      
      if (error) {
        alert("An error occurred during import: " + error.message);
      } else {
        setImportSummary({
          success: parsedData.valid.length,
          failed: parsedData.invalid.length
        });
        setStep(3); // summary step
        onSuccess(); // refresh parent list
      }
    } catch (err) {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setFile(null);
    setParsedData({ valid: [], invalid: [] });
    setImportSummary(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="admin-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="admin-modal-content" style={{ backgroundColor: 'white', borderRadius: '8px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Import Internship Certificates</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e5e7eb', fontSize: '12px' }}>1</span>
                  Download sample CSV
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>Start with our template to ensure your data is formatted correctly.</p>
                <button onClick={downloadSample} className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={16} /> Download Sample CSV
                </button>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e5e7eb', fontSize: '12px' }}>2</span>
                  Prepare your CSV
                </h3>
                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Required columns (Exact match):</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {requiredColumns.map(col => (
                      <span key={col} style={{ backgroundColor: 'white', border: '1px solid #d1d5db', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e5e7eb', fontSize: '12px' }}>3</span>
                  Upload CSV
                </h3>
                <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '40px 20px', textAlign: 'center', backgroundColor: '#f9fafb' }}>
                  <Upload size={32} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>Select the CSV file you prepared.</p>
                  <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                    Choose CSV File
                    <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>CSV Import Preview</h3>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Loader2 className="spinner" size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px', color: '#6b7280' }} />
                  <p>Processing CSV file...</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>{parsedData.valid.length + parsedData.invalid.length}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Total Rows</div>
                    </div>
                    <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534' }}>{parsedData.valid.length}</div>
                      <div style={{ fontSize: '12px', color: '#15803d', textTransform: 'uppercase' }}>Valid Rows</div>
                    </div>
                    <div style={{ backgroundColor: parsedData.invalid.length > 0 ? '#fef2f2' : '#f9fafb', padding: '16px', borderRadius: '8px', border: `1px solid ${parsedData.invalid.length > 0 ? '#fecaca' : '#e5e7eb'}`, textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: parsedData.invalid.length > 0 ? '#991b1b' : '#111827' }}>{parsedData.invalid.length}</div>
                      <div style={{ fontSize: '12px', color: parsedData.invalid.length > 0 ? '#b91c1c' : '#6b7280', textTransform: 'uppercase' }}>Errors</div>
                    </div>
                  </div>

                  {parsedData.invalid.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={16} /> Error Report (These rows will be skipped)
                      </h4>
                      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #fecaca', borderRadius: '8px', backgroundColor: '#fef2f2' }}>
                        <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                          <thead style={{ backgroundColor: '#fee2e2', position: 'sticky', top: 0 }}>
                            <tr>
                              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #fecaca', width: '80px' }}>Row</th>
                              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #fecaca', width: '180px' }}>Certificate No.</th>
                              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #fecaca' }}>Problem</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parsedData.invalid.map((inv, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #fecaca' }}>
                                <td style={{ padding: '8px 12px' }}>{inv.rowNumber}</td>
                                <td style={{ padding: '8px 12px', fontWeight: '500' }}>{inv.certificate_number}</td>
                                <td style={{ padding: '8px 12px', color: '#b91c1c' }}>{inv.error}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {parsedData.valid.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={16} /> Valid Data Preview
                      </h4>
                      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                        <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                          <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0 }}>
                            <tr>
                              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Certificate No.</th>
                              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Title</th>
                              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parsedData.valid.slice(0, 20).map((v, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px 12px', fontWeight: '500' }}>{v.certificate_number}</td>
                                <td style={{ padding: '8px 12px' }}>{v.recipient_name}</td>
                                <td style={{ padding: '8px 12px' }}>{v.certificate_title}</td>
                                <td style={{ padding: '8px 12px' }}>
                                  <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: v.status === 'valid' ? '#dcfce7' : '#fee2e2', color: v.status === 'valid' ? '#166534' : '#991b1b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                                    {v.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {parsedData.valid.length > 20 && (
                              <tr>
                                <td colSpan="4" style={{ padding: '8px 12px', textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                                  ... and {parsedData.valid.length - 20} more rows
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {step === 3 && importSummary && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <CheckCircle size={64} color="#16a34a" style={{ margin: '0 auto 24px' }} />
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                Import Successful
              </h2>
              <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '24px' }}>
                <strong>{importSummary.success}</strong> certificates have been successfully imported into the system.
              </p>
              {importSummary.failed > 0 && (
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                  ({importSummary.failed} rows were skipped due to errors)
                </p>
              )}
              <button onClick={handleClose} className="admin-btn admin-btn-primary">
                Return to Certificates
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={() => setStep(1)} className="admin-btn admin-btn-secondary" disabled={loading}>
              Back
            </button>
            <button 
              onClick={handleImport} 
              className="admin-btn admin-btn-primary" 
              disabled={loading || parsedData.valid.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {loading && <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Importing...' : `Import ${parsedData.valid.length} Certificates`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
