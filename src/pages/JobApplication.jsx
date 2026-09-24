import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../admin/services/supabase';
import { 
  Building2, MapPin, Briefcase, Clock, 
  UploadCloud, X, CheckCircle, FileText 
} from 'lucide-react';
import styles from './JobApplication.module.css';

export default function JobApplication() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    candidate_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    current_city: '',
    state: '',
    country: 'India',
    current_status: '',
    organization: '',
    present_role: '',
    qualification: '',
    degree: '',
    specialization: '',
    college: '',
    graduation_year: '',
    experience_years: '',
    experience_level: '',
    experience_summary: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    other_url: '',
    cover_letter: '',
    declaration: false
  });
  
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [applicationRef, setApplicationRef] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchJob();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`*, job_categories(name)`)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
        
      if (error) throw error;
      
      // Check if job is closed manually or by deadline
      if (data.status === 'closed') {
        setError('Applications Closed');
        return;
      }
      
      setJob(data);
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Job Not Found');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }
    
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeFile) {
      alert('Please upload your resume.');
      return;
    }
    
    if (!formData.declaration) {
      alert('Please agree to the declaration.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // 1. Check for duplicate application
      const { data: existingApps, error: checkError } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', job.id)
        .eq('email', formData.email)
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (existingApps && existingApps.length > 0) {
        setAlreadyApplied(true);
        setSubmitting(false);
        return;
      }

      // 2. Upload Resume to Storage
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}_${formData.candidate_name.replace(/\s+/g, '_')}.${fileExt}`;
      const filePath = `resumes/${job.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('job-resumes')
        .upload(filePath, resumeFile);
        
      if (uploadError) {
        console.error('Upload Error:', uploadError);
        alert('Failed to upload resume. Make sure the job-resumes bucket exists and allows public inserts.');
        throw uploadError;
      }

      // 3. Create Application Record
      // Remove declaration from payload
      const { declaration, ...payloadData } = formData;
      
      const payload = {
        ...payloadData,
        job_id: job.id,
        skills: skills,
        resume_path: filePath,
        status: 'New'
      };

      const { data: appData, error: appError } = await supabase
        .from('job_applications')
        .insert([payload])
        .select('application_reference')
        .single();
        
      if (appError) throw appError;

      // 4. Success State
      setApplicationRef(appData.application_reference);
      setSuccess(true);
      window.scrollTo(0, 0);

    } catch (err) {
      console.error('Application Error:', err);
      alert('Error submitting application: ' + (err.message || err.details || JSON.stringify(err)));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>Loading application form...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container} style={{textAlign: 'center', padding: '60px 0'}}>
            <h2>{error || 'Job Not Found'}</h2>
            <p>This position is no longer accepting applications.</p>
            <Link to="/careers" className={styles.btnPrimary} style={{marginTop: '20px', display: 'inline-block'}}>Browse Jobs</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.successContainer}>
              <h2>You have already applied for this position.</h2>
              <p>An application with the email <strong>{formData.email}</strong> is already on file for {job.title}.</p>
              <div className={styles.actionButtons}>
                <Link to={`/careers/jobs/${job.slug}`} className={styles.btnSecondary}>Back to Job</Link>
                <Link to="/careers" className={styles.btnPrimary}>Browse Other Jobs</Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.successContainer}>
              <CheckCircle size={64} className={styles.successIcon} />
              <h2>Application Submitted Successfully</h2>
              <p>Thank you for applying for the <strong>{job.title}</strong> position at {job.company_name}.</p>
              
              <div className={styles.referenceBox}>
                <div className={styles.refLabel}>Application ID</div>
                <div className={styles.refValue}>{applicationRef || 'LD-APP-PROCESSING'}</div>
                
                <div className={styles.refLabel}>Candidate</div>
                <div className={styles.refValue}>{formData.candidate_name}</div>
              </div>
              
              <p>We've received your application and our team will review it shortly.</p>
              
              <div className={styles.actionButtons}>
                <Link to={`/careers/jobs/${job.slug}`} className={styles.btnSecondary}>Back to Job</Link>
                <Link to="/careers" className={styles.btnPrimary}>View Careers</Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          
          {/* Job Summary Card */}
          <div className={styles.jobSummaryCard}>
            {job.company_logo_url ? (
              <img src={job.company_logo_url} alt={job.company_name} className={styles.companyLogo} />
            ) : (
              <div className={styles.logoPlaceholder}>
                {job.company_name ? job.company_name.charAt(0).toUpperCase() : <Building2 size={32} />}
              </div>
            )}
            
            <div className={styles.jobInfo}>
              <p>Applying for:</p>
              <h1>{job.title}</h1>
              <div className={styles.jobMeta}>
                <span>{job.company_name}</span>
                {job.location && (
                  <>
                    <span>•</span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><MapPin size={14}/> {job.location}</span>
                  </>
                )}
                {job.work_mode && (
                  <>
                    <span>•</span>
                    <span>{job.work_mode}</span>
                  </>
                )}
              </div>
            </div>
            
            <div style={{marginLeft: 'auto'}}>
              <Link to={`/careers/jobs/${job.slug}`} style={{color: '#16a34a', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>View Job Details</Link>
            </div>
          </div>
          
          {/* Application Form */}
          <div className={styles.applicationForm}>
            <div className={styles.formHeader}>
              <h2>Apply for this position</h2>
              <p>Complete the form below to submit your application.</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              
              {/* SECTION: Personal Information */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Personal Information</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Full Name <span className={styles.required}>*</span></label>
                    <input type="text" name="candidate_name" required value={formData.candidate_name} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email Address <span className={styles.required}>*</span></label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number <span className={styles.required}>*</span></label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>WhatsApp Number</label>
                    <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Current City</label>
                    <input type="text" name="current_city" value={formData.current_city} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className={styles.input} />
                  </div>
                </div>
              </div>

              {/* SECTION: Professional Information */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Professional Information</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Current Status <span className={styles.required}>*</span></label>
                    <select name="current_status" required value={formData.current_status} onChange={handleChange} className={styles.select}>
                      <option value="">Select status</option>
                      <option value="Student">Student</option>
                      <option value="Fresher">Fresher</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Looking for Internship">Looking for Internship</option>
                      <option value="Career Switcher">Career Switcher</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Experience Level <span className={styles.required}>*</span></label>
                    <select name="experience_level" required value={formData.experience_level} onChange={handleChange} className={styles.select}>
                      <option value="">Select level</option>
                      <option value="Student">Student</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="0-1 Years">0–1 Years</option>
                      <option value="1-2 Years">1–2 Years</option>
                      <option value="2-5 Years">2–5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Current Organization / College</label>
                    <input type="text" name="organization" value={formData.organization} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Current Role / Degree</label>
                    <input type="text" name="present_role" value={formData.present_role} onChange={handleChange} className={styles.input} />
                  </div>
                </div>
              </div>

              {/* SECTION: Education */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Education</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Highest Qualification <span className={styles.required}>*</span></label>
                    <select name="qualification" required value={formData.qualification} onChange={handleChange} className={styles.select}>
                      <option value="">Select qualification</option>
                      <option value="10th">10th</option>
                      <option value="12th">12th</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Degree / Course</label>
                    <input type="text" name="degree" value={formData.degree} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Specialization</label>
                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>College / University</label>
                    <input type="text" name="college" value={formData.college} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Graduation Year</label>
                    <input type="text" name="graduation_year" value={formData.graduation_year} onChange={handleChange} className={styles.input} />
                  </div>
                </div>
              </div>

              {/* SECTION: Skills & Experience */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Skills & Experience</h3>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Key Skills</label>
                    <div className={styles.skillsContainer}>
                      <div className={styles.skillInputWrapper}>
                        <input 
                          type="text" 
                          value={currentSkill} 
                          onChange={(e) => setCurrentSkill(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                          placeholder="e.g. React, Python (Press Add)" 
                          className={styles.input} 
                        />
                        <button type="button" onClick={handleAddSkill} className={styles.addSkillBtn}>Add</button>
                      </div>
                      {skills.length > 0 && (
                        <div className={styles.skillsList}>
                          {skills.map((skill, index) => (
                            <span key={index} className={styles.skillTag}>
                              {skill}
                              <button type="button" onClick={() => removeSkill(skill)} className={styles.removeSkillBtn}>
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Briefly describe your relevant experience</label>
                    <textarea name="experience_summary" value={formData.experience_summary} onChange={handleChange} className={styles.textarea} />
                  </div>
                </div>
              </div>

              {/* SECTION: Resume */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Resume <span className={styles.required}>*</span></h3>
                
                {!resumeFile ? (
                  <div className={styles.fileUploadArea} onClick={() => fileInputRef.current?.click()}>
                    <UploadCloud size={32} className={styles.fileIcon} />
                    <p className={styles.fileUploadText}>Click to upload your resume</p>
                    <p className={styles.fileUploadSubtext}>PDF, DOC, DOCX up to 10MB</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className={styles.fileInput} 
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    />
                  </div>
                ) : (
                  <div className={styles.selectedFile}>
                    <div className={styles.fileInfo}>
                      <FileText size={24} style={{color: '#16a34a'}} />
                      <div>
                        <div className={styles.fileName}>{resumeFile.name}</div>
                        <div className={styles.fileSize}>{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setResumeFile(null)} className={styles.removeFileBtn} title="Remove File">
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION: Professional Links */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Professional Links</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>LinkedIn Profile</label>
                    <input type="url" name="linkedin_url" placeholder="https://linkedin.com/in/..." value={formData.linkedin_url} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>GitHub Profile</label>
                    <input type="url" name="github_url" placeholder="https://github.com/..." value={formData.github_url} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Portfolio / Personal Website</label>
                    <input type="url" name="portfolio_url" placeholder="https://..." value={formData.portfolio_url} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Other Relevant Link</label>
                    <input type="url" name="other_url" value={formData.other_url} onChange={handleChange} className={styles.input} />
                  </div>
                </div>
              </div>

              {/* SECTION: Cover Letter */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Cover Letter</h3>
                <div className={styles.formGroup}>
                  <textarea 
                    name="cover_letter" 
                    value={formData.cover_letter} 
                    onChange={handleChange} 
                    className={styles.textarea} 
                    placeholder="Tell us briefly why you are interested in this role and what makes you a good fit."
                  />
                </div>
              </div>

              {/* SECTION: Declaration */}
              <div className={styles.formSection}>
                <div className={styles.checkboxGroup}>
                  <input 
                    type="checkbox" 
                    id="declaration" 
                    name="declaration"
                    checked={formData.declaration}
                    onChange={handleChange}
                    className={styles.checkbox} 
                  />
                  <label htmlFor="declaration" className={styles.checkboxLabel}>
                    <strong>I confirm that the information provided in this application is accurate and complete.</strong><br/>
                    By submitting this application, you agree that LearnDepth may use the information provided to evaluate your application for this role.
                  </label>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Submitting Application...' : 'Submit Application'}
              </button>

            </form>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
