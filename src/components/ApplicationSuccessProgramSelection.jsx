import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, GraduationCap, Crown, Check } from 'lucide-react';
import ProgramEnquiryModal from './ProgramEnquiryModal';
import '../styles/ApplicationSuccessProgramSelection.css';

export default function ApplicationSuccessProgramSelection() {
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const handleToggle = (id) => {
    setExpandedProgram(expandedProgram === id ? null : id);
  };

  return (
    <div className="ml-success-selection-wrapper">
      
      {/* Success Message Header */}
      <div className="ml-success-header">
        <div className="ml-success-icon-wrapper">
          <CheckCircle2 size={48} className="ml-success-icon" />
        </div>
        <h2 className="ml-success-title">Application Submitted <span className="ml-success-accent">Successfully!</span></h2>
        <p className="ml-success-desc">
          Choose the program that best matches your learning and career goals.
        </p>
      </div>

      {/* Program Selection Cards */}
      <div className="ml-program-cards-container">
        
        {/* Basic Learning Internship */}
        <div className={`ml-program-card ${expandedProgram === 'basic' ? 'expanded' : ''}`}>
          <div className="ml-program-card-summary" onClick={() => handleToggle('basic')}>
            <div className="ml-program-card-header">
              <div className="ml-program-card-header-left">
                <div style={{ fontSize: '1.5rem', marginRight: '4px', lineHeight: '1' }}>🎓</div>
                <div>
                  <h3 className="ml-program-card-title">Basic Learning Internship</h3>
                  <p className="ml-program-card-short-desc">Build foundational skills, complete practical tasks and gain internship experience.</p>
                </div>
              </div>
              <div className="ml-program-card-header-right">
                <div className="ml-program-price-block">
                  <span className="ml-program-price">₹149</span>
                  <span className="ml-program-price-label">One-time payment</span>
                </div>
              </div>
            </div>
            
            <div className="ml-program-card-toggle">
              <button className="ml-program-toggle-btn">
                {expandedProgram === 'basic' ? (
                  <>Hide Details <ChevronUp size={16} /></>
                ) : (
                  <>View Program Details <ChevronDown size={16} /></>
                )}
              </button>
            </div>
          </div>

          {expandedProgram === 'basic' && (
            <div className="ml-program-expanded-content">
              <div className="ml-program-divider"></div>
              <h4 className="ml-program-features-title">What's Included?</h4>
              <ul className="ml-program-features-list one-col">
                <li><Check size={16} className="ml-feature-check" /> Learning resources</li>
                <li><Check size={16} className="ml-feature-check" /> Internship experience</li>
                <li><Check size={16} className="ml-feature-check" /> Assignments & assessments</li>
                <li><Check size={16} className="ml-feature-check" /> Hands-on project</li>
                <li><Check size={16} className="ml-feature-check" /> Certificate of completion</li>
                <li><Check size={16} className="ml-feature-check" /> Community access</li>
                <li><Check size={16} className="ml-feature-check" /> Basic doubt support</li>
              </ul>
              
              <div className="ml-program-actions">
                <button className="ml-program-btn-primary basic-btn" onClick={() => window.location.href = "https://rzp.io/rzp/learndepth-trainingprogram"}>
                  Register for ₹149 &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Job-Assisted ML Program */}
        <div className={`ml-program-card premium-card ${expandedProgram === 'ml-career' ? 'expanded' : ''}`}>
          <div className="ml-program-card-summary" onClick={() => handleToggle('ml-career')}>
            <div className="ml-program-card-header">
              <div className="ml-program-card-header-left" style={{ flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: '700', fontSize: '0.85rem' }}>
                  ⭐ RECOMMENDED
                </div>
                <div>
                  <h3 className="ml-program-card-title">Job-Assisted ML Program + Internship</h3>
                  <p className="ml-program-card-short-desc">A career-focused Machine Learning program combining structured learning, projects, internship experience and career support.</p>
                </div>
              </div>
              <div className="ml-program-card-header-right">
                <div className="ml-program-price-block">
                  <span className="ml-program-price">₹1,699</span>
                  <span className="ml-program-price-label">One-time payment</span>
                </div>
              </div>
            </div>
            
            <div className="ml-program-card-toggle">
              <button className="ml-program-toggle-btn">
                {expandedProgram === 'ml-career' ? (
                  <>Hide Details <ChevronUp size={16} /></>
                ) : (
                  <>View Program Details <ChevronDown size={16} /></>
                )}
              </button>
            </div>
          </div>

          {expandedProgram === 'ml-career' && (
            <div className="ml-program-expanded-content">
              <div className="ml-program-divider"></div>
              <h4 className="ml-program-features-title">What's Included?</h4>
              <ul className="ml-program-features-list two-col">
                <li><Check size={16} className="ml-feature-check" /> Structured ML curriculum</li>
                <li><Check size={16} className="ml-feature-check" /> Hands-on real-world projects</li>
                <li><Check size={16} className="ml-feature-check" /> Internship experience</li>
                <li><Check size={16} className="ml-feature-check" /> Mentor guidance</li>
                <li><Check size={16} className="ml-feature-check" /> Code reviews</li>
                <li><Check size={16} className="ml-feature-check" /> Resume building</li>
                <li><Check size={16} className="ml-feature-check" /> LinkedIn profile support</li>
                <li><Check size={16} className="ml-feature-check" /> Portfolio development</li>
                <li><Check size={16} className="ml-feature-check" /> Technical interview preparation</li>
                <li><Check size={16} className="ml-feature-check" /> HR interview preparation</li>
                <li><Check size={16} className="ml-feature-check" /> Aptitude preparation</li>
                <li><Check size={16} className="ml-feature-check" /> Job / internship assistance</li>
                <li><Check size={16} className="ml-feature-check" /> Career guidance</li>
                <li><Check size={16} className="ml-feature-check" /> Certificate</li>
                <li><Check size={16} className="ml-feature-check" /> Community & networking access</li>
              </ul>
              
              <div className="ml-program-actions split-actions">
                <button className="ml-program-btn-primary premium-btn" onClick={() => window.location.href = "https://rzp.io/rzp/learndepthcareer"}>
                  Pay & Register Now — ₹1,699 &rarr;
                </button>
                <button className="ml-program-btn-secondary" onClick={() => setIsEnquiryModalOpen(true)}>
                  Request More Information
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      <ProgramEnquiryModal 
        isOpen={isEnquiryModalOpen} 
        onClose={() => setIsEnquiryModalOpen(false)} 
        selectedProgramName="Job-Assisted ML Program + Internship"
      />
    </div>
  );
}
