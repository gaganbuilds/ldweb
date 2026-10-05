import React, { useState } from 'react';
import { Check, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../admin/services/supabase';
import ApplicationSuccessProgramSelection from './ApplicationSuccessProgramSelection';
import '../styles/InternshipApplicationCTA.css';

export default function InternshipApplicationCTA() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    college_university: '',
    course_degree: '',
    course_other: '',
    current_year: '',
    preferred_domain: 'Machine Learning',
    how_heard: '',
    how_heard_other: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'duplicate', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      // 1. Duplicate check
      const { data: existingApp, error: checkError } = await supabase
        .from('internship_applications')
        .select('id')
        .eq('email', formData.email.trim())
        .eq('preferred_domain', formData.preferred_domain)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingApp) {
        setSubmitStatus('duplicate');
        setIsSubmitting(false);
        return;
      }

      // 2. Prepare data
      const finalCourse = formData.course_degree === 'Other' ? formData.course_other : formData.course_degree;
      
      const insertData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college_university: formData.college_university.trim(),
        course_degree: finalCourse,
        current_year: formData.current_year,
        preferred_domain: formData.preferred_domain,
        how_heard: formData.how_heard,
        how_heard_other: formData.how_heard === 'Other' ? formData.how_heard_other : null,
        status: 'New',
        priority: 'Normal'
      };

      // 3. Insert
      const { error: insertError } = await supabase
        .from('internship_applications')
        .insert([insertData]);

      if (insertError) throw insertError;

      setSubmitStatus('success');
    } catch (err) {
      console.error('Error submitting application:', err);
      setErrorMessage('Something went wrong while submitting your application. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="internship-form" className="ml-app-cta-section">
      <div className="ml-app-cta-container">
        
        {/* Left Side */}
          <div className="ml-app-cta-left">
            <div className="ml-app-cta-badge">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Applications Open
            </div>
            
            <h2 className="ml-app-cta-heading">
              Ready to Start Your <br/>
              <span className="ml-app-cta-heading-accent">Machine Learning Journey?</span>
            </h2>
            
            <p className="ml-app-cta-desc">
              Build practical skills, work on projects and gain hands-on internship experience with LearnDepth. Tell us a little about yourself and we'll take it from there.
            </p>
            
            <div className="ml-app-cta-benefits">
              <div className="ml-app-cta-benefit-item">
                <div className="ml-app-cta-benefit-icon"><Check size={18} /></div>
                Practical Machine Learning Learning
              </div>
              <div className="ml-app-cta-benefit-item">
                <div className="ml-app-cta-benefit-icon"><Check size={18} /></div>
                Hands-on Projects
              </div>
              <div className="ml-app-cta-benefit-item">
                <div className="ml-app-cta-benefit-icon"><Check size={18} /></div>
                1 Month Internship Experience
              </div>
              <div className="ml-app-cta-benefit-item">
                <div className="ml-app-cta-benefit-icon"><Check size={18} /></div>
                Mentor & Doubt Support
              </div>
            </div>
            
            <div className="ml-app-cta-program-info">
              <div className="ml-app-cta-program-title">Machine Learning Internship</div>
              <div className="ml-app-cta-program-grid">
                <div className="ml-app-cta-program-stat">
                  <span>Duration</span>
                  <span>1 Month Internship</span>
                </div>
                <div className="ml-app-cta-program-stat">
                  <span>Mode</span>
                  <span>Online</span>
                </div>
                <div className="ml-app-cta-program-stat">
                  <span>Learning Type</span>
                  <span>Project-Based</span>
                </div>
                <div className="ml-app-cta-program-stat">
                  <span>Outcome</span>
                  <span>Certificate on Completion</span>
                </div>
              </div>
            </div>
          </div>

        {/* Right Side */}
        <div className="ml-app-cta-right">
          <div className="ml-app-cta-form-card">
            
            {submitStatus === 'success' ? (
              <ApplicationSuccessProgramSelection />
            ) : (
              <>
                <h3 className="ml-app-cta-form-heading">Apply for the Machine Learning Internship</h3>
                <p className="ml-app-cta-form-subheading">Fill in your details and our team will get in touch with you regarding the internship.</p>

                {submitStatus === 'duplicate' && (
                  <div className="ml-app-form-global-error" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fcd34d' }}>
                    You’ve already submitted an application for this internship domain. Our team will get in touch with you if there is an update.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="ml-app-form-global-error">
                    {errorMessage}
                  </div>
                )}

                <form className="ml-app-form" onSubmit={handleSubmit}>
                  <div className="ml-app-form-group">
                    <label className="ml-app-form-label">Full Name *</label>
                    <input 
                      type="text" 
                      name="full_name" 
                      className="ml-app-form-input" 
                      placeholder="Enter your full name" 
                      required 
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="ml-app-form-group">
                    <label className="ml-app-form-label">Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      className="ml-app-form-input" 
                      placeholder="Enter your email address" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="ml-app-form-group">
                    <label className="ml-app-form-label">WhatsApp / Mobile Number *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      className="ml-app-form-input" 
                      placeholder="Enter 10-digit mobile number" 
                      required 
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="ml-app-form-group">
                    <label className="ml-app-form-label">College / University Name *</label>
                    <input 
                      type="text" 
                      name="college_university" 
                      className="ml-app-form-input" 
                      placeholder="Enter your college or university" 
                      required 
                      value={formData.college_university}
                      onChange={handleChange}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="ml-app-form-group">
                      <label className="ml-app-form-label">Course / Degree *</label>
                      <select 
                        name="course_degree" 
                        className="ml-app-form-select" 
                        required
                        value={formData.course_degree}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select Course</option>
                        <option value="B.E / B.Tech">B.E / B.Tech</option>
                        <option value="BCA">BCA</option>
                        <option value="B.Sc">B.Sc</option>
                        <option value="MCA">MCA</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="M.Sc">M.Sc</option>
                        <option value="BBA">BBA</option>
                        <option value="MBA">MBA</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="ml-app-form-group">
                      <label className="ml-app-form-label">Current Year *</label>
                      <select 
                        name="current_year" 
                        className="ml-app-form-select" 
                        required
                        value={formData.current_year}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Final Year">Final Year</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {formData.course_degree === 'Other' && (
                    <div className="ml-app-form-group">
                      <label className="ml-app-form-label">Please specify your Course *</label>
                      <input 
                        type="text" 
                        name="course_other" 
                        className="ml-app-form-input" 
                        placeholder="E.g. B.Com" 
                        required 
                        value={formData.course_other}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <div className="ml-app-form-group">
                    <label className="ml-app-form-label">Preferred Internship Domain *</label>
                    <select 
                      name="preferred_domain" 
                      className="ml-app-form-select" 
                      required
                      value={formData.preferred_domain}
                      onChange={handleChange}
                    >
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Python Development">Python Development</option>
                      <option value="Web Development">Web Development</option>
                      <option value="App Development">App Development</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="ml-app-form-group">
                    <label className="ml-app-form-label">How did you hear about LearnDepth? *</label>
                    <select 
                      name="how_heard" 
                      className="ml-app-form-select" 
                      required
                      value={formData.how_heard}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select Source</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Google Search">Google Search</option>
                      <option value="College / University">College / University</option>
                      <option value="Friend / Referral">Friend / Referral</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Campus Ambassador">Campus Ambassador</option>
                      <option value="Workshop / Event">Workshop / Event</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {formData.how_heard === 'Other' && (
                    <div className="ml-app-form-group">
                      <label className="ml-app-form-label">Please specify source *</label>
                      <input 
                        type="text" 
                        name="how_heard_other" 
                        className="ml-app-form-input" 
                        placeholder="E.g. Facebook" 
                        required 
                        value={formData.how_heard_other}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="ml-app-form-submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        Apply for Internship <ChevronRight size={20} />
                      </>
                    )}
                  </button>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center', marginTop: '4px' }}>
                    Your information is secure and confidential.
                  </div>
                </form>
              </>
            )}
            
          </div>
        </div>

      </div>
    </section>
  );
}
