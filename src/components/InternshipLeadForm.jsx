import { useState } from 'react';
import { Send } from 'lucide-react';
import styles from './InternshipLeadSection.module.css';
import LeadSuccessState from './LeadSuccessState';
import { supabase } from '../admin/services/supabase';

const internshipDomains = [
  "Machine Learning Internship",
  "Data Science Internship",
  "Python Internship",
  "Web Development Internship",
  "App Development Internship",
  "AI / Generative AI Internship",
  "Java Internship",
  "Sales & Marketing Internship",
  "Other"
];

const currentYearOptions = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Graduate",
  "Other"
];

export default function InternshipLeadForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    college: '',
    currentYear: '',
    domain: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Pre-fill from URL param if available
  useState(() => { // we can use useEffect instead, let's import it
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const programParam = urlParams.get('program');
      if (programParam) {
        // Try to match URL param string (e.g. "machine-learning") with domains
        const formattedParam = programParam.replace(/-/g, ' ').toLowerCase();
        const matchedDomain = internshipDomains.find(d => 
          d.toLowerCase().includes(formattedParam)
        );
        if (matchedDomain) {
          setFormData(prev => ({ ...prev, domain: matchedDomain }));
          
          // Also automatically scroll to this form on mount if param exists
          setTimeout(() => {
            document.getElementById('internship-form')?.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        }
      }
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.college.trim()) newErrors.college = 'College / Institution is required';
    if (!formData.currentYear) newErrors.currentYear = 'Please select your current year';
    if (!formData.domain) newErrors.domain = 'Please select an internship domain';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For mobile, only allow digits
    if (name === 'mobile' && value && !/^\d*$/.test(value)) return;
    if (name === 'mobile' && value.length > 10) return;

    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError('');
  };

  const submitInternshipLead = async (data) => {
    const { data: result, error } = await supabase
      .from('internship_enquiries')
      .insert([
        {
          full_name: data.fullName,
          email: data.email,
          phone: data.mobile,
          college: data.college,
          current_year: data.currentYear,
          interested_internship: data.domain,
          message: data.message,
          source_page: 'Homepage - Internship Enquiry',
          status: 'New',
          priority: 'Medium'
        }
      ]);
    
    if (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
    
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await submitInternshipLead(formData);
      setIsSuccess(true);
    } catch (error) {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <LeadSuccessState onReset={() => {
      setIsSuccess(false);
      setFormData({ fullName: '', email: '', mobile: '', college: '', currentYear: '', domain: '', message: '' });
    }} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* 1. Full Name */}
      <div className={styles.formGroup}>
        <label htmlFor="fullName" className={styles.label}>Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
        />
        {errors.fullName && <span id="fullName-error" className={styles.errorText}>{errors.fullName}</span>}
      </div>

      {/* 2. Email Address */}
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && <span id="email-error" className={styles.errorText}>{errors.email}</span>}
      </div>

      {/* 3. Mobile Number */}
      <div className={styles.formGroup}>
        <label htmlFor="mobile" className={styles.label}>Mobile Number</label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          className={`${styles.input} ${errors.mobile ? styles.inputError : ''}`}
          placeholder="Enter 10-digit mobile number"
          value={formData.mobile}
          onChange={handleChange}
          aria-describedby={errors.mobile ? "mobile-error" : undefined}
        />
        {errors.mobile && <span id="mobile-error" className={styles.errorText}>{errors.mobile}</span>}
      </div>

      {/* 4. College / Institution */}
      <div className={styles.formGroup}>
        <label htmlFor="college" className={styles.label}>College / Institution</label>
        <input
          type="text"
          id="college"
          name="college"
          className={`${styles.input} ${errors.college ? styles.inputError : ''}`}
          placeholder="Enter your college or institution"
          value={formData.college}
          onChange={handleChange}
          aria-describedby={errors.college ? "college-error" : undefined}
        />
        {errors.college && <span id="college-error" className={styles.errorText}>{errors.college}</span>}
      </div>

      {/* 5. Current Year */}
      <div className={styles.formGroup}>
        <label htmlFor="currentYear" className={styles.label}>Current Year</label>
        <select
          id="currentYear"
          name="currentYear"
          className={`${styles.select} ${errors.currentYear ? styles.inputError : ''}`}
          value={formData.currentYear}
          onChange={handleChange}
          aria-describedby={errors.currentYear ? "currentYear-error" : undefined}
        >
          <option value="" disabled>Select your current year</option>
          {currentYearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        {errors.currentYear && <span id="currentYear-error" className={styles.errorText}>{errors.currentYear}</span>}
      </div>

      {/* 6. Internship Domain */}
      <div className={styles.formGroup}>
        <label htmlFor="domain" className={styles.label}>Internship Domain</label>
        <select
          id="domain"
          name="domain"
          className={`${styles.select} ${errors.domain ? styles.inputError : ''}`}
          value={formData.domain}
          onChange={handleChange}
          aria-describedby={errors.domain ? "domain-error" : undefined}
        >
          <option value="" disabled>Select internship domain</option>
          {internshipDomains.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {errors.domain && <span id="domain-error" className={styles.errorText}>{errors.domain}</span>}
      </div>

      {/* 7. Message (Optional) */}
      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>Message (Optional)</label>
        <textarea
          id="message"
          name="message"
          className={styles.input}
          placeholder="Any additional information..."
          value={formData.message}
          onChange={handleChange}
          rows="3"
          style={{ resize: 'vertical' }}
        />
      </div>

      {submitError && <div className={styles.errorText} style={{marginBottom: '12px', fontSize: '14px'}}>{submitError}</div>}

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Apply for Internship'}
        {!isSubmitting && <Send size={18} />}
      </button>
    </form>
  );
}
