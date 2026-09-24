import React, { useState, useEffect } from 'react';
import { X, CheckCircle, BookOpen, User, Phone, Mail, GraduationCap, Briefcase } from 'lucide-react';
import styles from './ProgramEnquiryModal.module.css';
import { supabase } from '../admin/services/supabase';

export default function ProgramEnquiryModal({ 
  isOpen, 
  onClose, 
  selectedProgramId, 
  selectedProgramName,
  programsList = [] // Array of { id, title }
}) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    qualification: '',
    college: '',
    graduation_year: '',
    program_id: selectedProgramId || '',
    learning_preference: 'Not Sure Yet',
    preferred_batch: 'Flexible / Not Sure',
    current_status: 'Student',
    enquiry_reason: 'Learn new skills',
    message: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  // Update selected program if it changes from props
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        program_id: selectedProgramId || (programsList.length > 0 ? programsList[0].id : '')
      }));
      setStatus('idle');
      setErrorMsg('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, selectedProgramId, programsList]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getProgramNameById = (id) => {
    const prog = programsList.find(p => p.id === id);
    return prog ? prog.title : selectedProgramName;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const pName = getProgramNameById(formData.program_id);
      
      const { data, error } = await supabase
        .from('program_enquiries')
        .insert([{
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          qualification: formData.qualification,
          college: formData.college,
          graduation_year: formData.graduation_year,
          program_id: formData.program_id,
          program_name: pName,
          learning_preference: formData.learning_preference,
          preferred_batch: formData.preferred_batch,
          current_status: formData.current_status,
          enquiry_reason: formData.enquiry_reason,
          message: formData.message,
          source: 'Website - Program Enquiry',
          lead_status: 'New',
          priority: 'Normal'
        }]);

      if (error) throw error;
      
      setStatus('success');
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setErrorMsg(`Failed to submit: ${err.message || err.details || 'Unknown error'}`);
      setStatus('error');
    }
  };

  const currentProgName = getProgramNameById(formData.program_id);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className={styles.modalBody}>
          
          <div className={styles.visualSide}>
            <div className={styles.visualBg}></div>
            <div className={styles.visualContent}>
              <h2 className={styles.visualTitle}>Build Skills That Move Your Career Forward</h2>
              <p className={styles.visualText}>
                Get program details, learning guidance and career-focused support from the LearnDepth team.
              </p>
              <ul className={styles.benefitsList}>
                <li className={styles.benefitItem}>
                  <CheckCircle size={18} className={styles.benefitIcon} />
                  Industry-focused learning
                </li>
                <li className={styles.benefitItem}>
                  <CheckCircle size={18} className={styles.benefitIcon} />
                  Practical projects & mentorship
                </li>
                <li className={styles.benefitItem}>
                  <CheckCircle size={18} className={styles.benefitIcon} />
                  Career and internship guidance
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.formSide}>
            {status === 'success' ? (
              <div className={styles.successState}>
                <CheckCircle size={64} className={styles.successIcon} />
                <h3 className={styles.successTitle}>Thank You for Your Enquiry!</h3>
                <p className={styles.successText}>
                  Your enquiry has been received successfully. Our LearnDepth team will get in touch with you soon regarding the <strong>{currentProgName}</strong> program.
                </p>
                <button className={styles.closeBtn} onClick={onClose}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.formContent}>
                <div className={styles.header}>
                  <h2 className={styles.title}>Enquire About This Program</h2>
                  <p className={styles.subtitle}>Share your details and our team will help you with the next steps.</p>
                  
                  {currentProgName && (
                    <div className={styles.programBadge}>
                      <span className={styles.programBadgeLabel}>Selected Program:</span> {currentProgName}
                    </div>
                  )}
                </div>

                {errorMsg && <div className={styles.errorText} style={{ marginBottom: '1rem', padding: '0.5rem', background: '#fee2e2', borderRadius: '4px' }}>{errorMsg}</div>}

                <h3 className={styles.sectionTitle}>Basic Details</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name <span className={styles.required}>*</span></label>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className={styles.input} required placeholder="John Doe" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address <span className={styles.required}>*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} required placeholder="john@example.com" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Mobile Number <span className={styles.required}>*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} required placeholder="+91 XXXXX XXXXX" pattern="[0-9\+\-\s]{10,15}" title="Please enter a valid phone number" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Current Education / Qualification <span className={styles.required}>*</span></label>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className={styles.input} required placeholder="e.g. B.Tech Computer Science" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>College / Institution</label>
                    <input type="text" name="college" value={formData.college} onChange={handleChange} className={styles.input} placeholder="e.g. IIT Delhi" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Graduation Year</label>
                    <input type="text" name="graduation_year" value={formData.graduation_year} onChange={handleChange} className={styles.input} placeholder="e.g. 2024" />
                  </div>
                </div>

                <h3 className={styles.sectionTitle}>Program Details</h3>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Selected Program <span className={styles.required}>*</span></label>
                    <select name="program_id" value={formData.program_id} onChange={handleChange} className={styles.select} required>
                      {programsList.map(prog => (
                        <option key={prog.id} value={prog.id}>{prog.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Learning Preference</label>
                    <select name="learning_preference" value={formData.learning_preference} onChange={handleChange} className={styles.select}>
                      <option value="Online">Online</option>
                      <option value="Classroom">Classroom</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Not Sure Yet">Not Sure Yet</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Preferred Batch</label>
                    <select name="preferred_batch" value={formData.preferred_batch} onChange={handleChange} className={styles.select}>
                      <option value="Weekday">Weekday</option>
                      <option value="Weekend">Weekend</option>
                      <option value="Flexible / Not Sure">Flexible / Not Sure</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Current Status</label>
                    <select name="current_status" value={formData.current_status} onChange={handleChange} className={styles.select}>
                      <option value="Student">Student</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Looking for a Career Change">Looking for a Career Change</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>What are you looking for?</label>
                    <select name="enquiry_reason" value={formData.enquiry_reason} onChange={handleChange} className={styles.select}>
                      <option value="Learn new skills">Learn new skills</option>
                      <option value="Career preparation">Career preparation</option>
                      <option value="Internship opportunities">Internship opportunities</option>
                      <option value="Job preparation">Job preparation</option>
                      <option value="Upskilling">Upskilling</option>
                      <option value="Exploring the field">Exploring the field</option>
                    </select>
                  </div>
                  
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Message / Additional Requirements (Optional)</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} className={styles.textarea} placeholder="Any specific questions or requirements?"></textarea>
                  </div>
                </div>

                <button type="submit" className={`${styles.submitBtn} ${styles.fullWidth}`} disabled={status === 'loading'}>
                  {status === 'loading' ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
