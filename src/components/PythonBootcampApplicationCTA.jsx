import React, { useState } from 'react';
import { Check, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../admin/services/supabase';
import '../styles/InternshipApplicationCTA.css'; // Reusing CSS from ML CTA

export default function PythonBootcampApplicationCTA() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    college_university: '',
    course_degree: '',
    course_other: '',
    current_year: '',
    python_skill_level: '',
    primary_goal: '',
    how_heard: '',
    how_heard_other: '',
    consent_to_contact: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'duplicate', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      // 1. Duplicate check
      const { data: existingApp, error: checkError } = await supabase
        .from('python_bootcamp_applications')
        .select('id')
        .eq('email', formData.email.trim())
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
        python_skill_level: formData.python_skill_level,
        primary_goal: formData.primary_goal,
        how_heard: formData.how_heard,
        how_heard_other: formData.how_heard === 'Other' ? formData.how_heard_other : null,
        application_status: 'New',
        payment_status: 'Not Started'
      };

      // 3. Insert
      const { error: insertError } = await supabase
        .from('python_bootcamp_applications')
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
    <section id="python-bootcamp-form" className="ml-app-cta-section">
      <div className="ml-app-cta-container">
        
        {/* Left Side */}
        <div className="ml-app-cta-left">
          <div className="ml-app-cta-badge">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Registrations Open
          </div>
          
          <h2 className="ml-app-cta-heading">
            Ready to Start Your <br/>
            <span className="ml-app-cta-heading-accent">Python Journey?</span>
          </h2>
          
          <p className="ml-app-cta-desc">
            Build practical skills, work on projects and gain hands-on experience with LearnDepth. Apply now and take the first step towards your career.
          </p>
          
          <div className="ml-app-cta-benefits">
            <div className="ml-app-cta-benefit-item">
              <div className="ml-app-cta-benefit-icon"><Check size={18} /></div>
              Practical Python Learning
            </div>
            <div className="ml-app-cta-benefit-item">
              <div className="ml-app-cta-benefit-icon"><Check size={18} /></div>
              Hands-on Projects
            </div>
            <div className="ml-app-cta-benefit-item">
              <div className="ml-app-cta-benefit-icon"><Check size={18} /></div>
              Internship Application Prep
            </div>
            <div className="ml-app-cta-benefit-item">
              <div className="ml-app-cta-benefit-icon"><Check size={18} /></div>
              Mentor & Doubt Support
            </div>
          </div>
          
          <div className="ml-app-cta-program-info">
            <div className="ml-app-cta-program-title">30-Day Python Bootcamp</div>
            <div className="ml-app-cta-program-grid">
              <div className="ml-app-cta-program-stat">
                <span>Duration</span>
                <span>30 Days</span>
              </div>
              <div className="ml-app-cta-program-stat">
                <span>Mode</span>
                <span>Online</span>
              </div>
              <div className="ml-app-cta-program-stat">
                <span>Price</span>
                <span>₹399 (Launch Offer)</span>
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
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Check size={48} color="#10b981" style={{ margin: '0 auto 20px' }} />
                <h3 className="ml-app-cta-form-heading">Application Submitted Successfully!</h3>
                <p className="ml-app-cta-form-subheading" style={{ marginTop: '16px' }}>
                  Thank you for your interest in the LearnDepth 30-Day Python Bootcamp. Our team will share the next steps for registration and payment via email and WhatsApp.
                </p>
              </div>
            ) : (
              <>
                <h3 className="ml-app-cta-form-heading">Apply for the Python Bootcamp</h3>
                <p className="ml-app-cta-form-subheading">Fill in your details and our team will get in touch with you regarding the program registration.</p>

                {submitStatus === 'duplicate' && (
                  <div className="ml-app-form-global-error" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fcd34d' }}>
                    You’ve already submitted an application for this bootcamp. Our team will get in touch with you shortly.
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
                        <option value="B.E. / B.Tech">B.E. / B.Tech</option>
                        <option value="BCA">BCA</option>
                        <option value="B.Sc.">B.Sc.</option>
                        <option value="B.Com.">B.Com.</option>
                        <option value="BBA">BBA</option>
                        <option value="MCA">MCA</option>
                        <option value="M.Tech.">M.Tech.</option>
                        <option value="M.Sc.">M.Sc.</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="ml-app-form-group">
                      <label className="ml-app-form-label">Current Year / Status *</label>
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
                        <option value="Recently Graduated">Recently Graduated</option>
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
                        placeholder="E.g. B.A." 
                        required 
                        value={formData.course_other}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <div className="ml-app-form-group">
                    <label className="ml-app-form-label">Current Python Skill Level *</label>
                    <select 
                      name="python_skill_level" 
                      className="ml-app-form-select" 
                      required
                      value={formData.python_skill_level}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select Level</option>
                      <option value="Complete Beginner">Complete Beginner</option>
                      <option value="Know the Basics">Know the Basics</option>
                      <option value="Have Practiced Small Programs">Have Practiced Small Programs</option>
                      <option value="Have Built a Python Project">Have Built a Python Project</option>
                    </select>
                  </div>
                  
                  <div className="ml-app-form-group">
                    <label className="ml-app-form-label">Primary Goal *</label>
                    <select 
                      name="primary_goal" 
                      className="ml-app-form-select" 
                      required
                      value={formData.primary_goal}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select Goal</option>
                      <option value="Prepare for a Python Internship">Prepare for a Python Internship</option>
                      <option value="Improve Practical Coding Skills">Improve Practical Coding Skills</option>
                      <option value="Build Real-World Projects">Build Real-World Projects</option>
                      <option value="Improve My GitHub Profile">Improve My GitHub Profile</option>
                      <option value="Prepare for Entry-Level Interviews">Prepare for Entry-Level Interviews</option>
                      <option value="Explore Python Automation">Explore Python Automation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="ml-app-form-group">
                    <label className="ml-app-form-label">How Did You Hear About LearnDepth? *</label>
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

                  <div className="ml-app-form-group" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <input 
                      type="checkbox" 
                      name="consent_to_contact"
                      id="consent"
                      required
                      checked={formData.consent_to_contact}
                      onChange={handleChange}
                      style={{ marginTop: '4px' }}
                    />
                    <label htmlFor="consent" style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                      I consent to being contacted regarding this program via email and WhatsApp.
                    </label>
                  </div>

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
                        Apply for the Python Bootcamp <ChevronRight size={20} />
                      </>
                    )}
                  </button>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center', marginTop: '12px' }}>
                    Submitting this form does not require immediate payment. <br/>
                    Our team will guide you through the next steps.
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
