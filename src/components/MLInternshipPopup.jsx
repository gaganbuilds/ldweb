import React, { useState, useEffect } from 'react';
import { X, Book, Settings, Briefcase, Users, Calendar, MonitorPlay, Award, Rocket } from 'lucide-react';
import '../styles/MLInternshipPopup.css';

export default function MLInternshipPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if the user is on an admin route
    if (window.location.pathname.startsWith('/admin')) {
      return;
    }

    // Check if we've already closed it in this session
    const hasClosed = sessionStorage.getItem('learndepth_ml_popup_closed');
    if (hasClosed === 'true') {
      return;
    }

    // Show after 5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
      document.body.style.overflow = 'hidden'; // Prevent scroll
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for the animation to finish
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      document.body.style.overflow = '';
      sessionStorage.setItem('learndepth_ml_popup_closed', 'true');
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleApplyClick = () => {
    handleClose();
    // Scroll to form or navigate depending on the current page
    if (window.location.pathname.includes('/internships/machine-learning')) {
      const formSection = document.getElementById('internship-form');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = '/internships/machine-learning#internship-form';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`ml-popup-backdrop ${isClosing ? 'closing' : ''}`} 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={`ml-popup-container ${isClosing ? 'closing' : ''}`}>
        
        <button 
          className="ml-popup-close" 
          onClick={handleClose} 
          aria-label="Close promotional popup"
        >
          <X size={24} color="#111827" />
        </button>

        <div className="ml-popup-content-wrapper">
          
          {/* Left Content Area */}
          <div className="ml-popup-left">
            <div className="ml-popup-badge">
              <Rocket size={14} color="#16a34a" /> 
              <span>Limited Seats</span>
            </div>

            <h2 className="ml-popup-headline">
              Job-Assisted<br/>
              <span className="text-highlight">Machine Learning</span><br/>
              Program + Internship
            </h2>

            <p className="ml-popup-desc">
              Learn in-demand skills, work on real-world projects and get job/internship assistance.
            </p>

            <div className="ml-popup-features">
              <div className="ml-popup-feature-item">
                <div className="ml-popup-feature-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                  <Book size={20} />
                </div>
                <span>Structured<br/>Curriculum</span>
              </div>
              <div className="ml-popup-feature-item">
                <div className="ml-popup-feature-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
                  <Settings size={20} />
                </div>
                <span>Hands-on<br/>Projects</span>
              </div>
              <div className="ml-popup-feature-item">
                <div className="ml-popup-feature-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <Briefcase size={20} />
                </div>
                <span>Internship<br/>Experience</span>
              </div>
              <div className="ml-popup-feature-item">
                <div className="ml-popup-feature-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
                  <Users size={20} />
                </div>
                <span>Job<br/>Assistance</span>
              </div>
            </div>

            <div className="ml-popup-info-row">
              <div className="ml-popup-info-item">
                <Calendar size={18} color="#16a34a" />
                <div>
                  <strong>12 Weeks</strong>
                  <span>Program Duration</span>
                </div>
              </div>
              <div className="ml-popup-info-divider"></div>
              <div className="ml-popup-info-item">
                <MonitorPlay size={18} color="#16a34a" />
                <div>
                  <strong>Mentor Support</strong>
                  <span>Live Guidance</span>
                </div>
              </div>
              <div className="ml-popup-info-divider"></div>
              <div className="ml-popup-info-item">
                <Award size={18} color="#16a34a" />
                <div>
                  <strong>Certificate</strong>
                  <span>On Completion</span>
                </div>
              </div>
            </div>

            <button className="ml-popup-cta" onClick={handleApplyClick}>
              Apply for ML Internship &rarr;
            </button>
          </div>

          {/* Right Visual Area */}
          <div className="ml-popup-right">
            {/* The student image */}
            <img src="/images/ml-hero-new.png" alt="Machine Learning Student" className="ml-popup-student-img" />
            
            {/* Floating Badges */}
            <div className="ml-popup-float ml-float-1">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python" style={{width: 24, height: 24}} />
            </div>
            
            <div className="ml-popup-float ml-float-2">
              <strong style={{ fontSize: '18px', color: '#059669', marginRight: '6px' }}>AI</strong> 
              <span>Artificial Intelligence</span>
            </div>

            <div className="ml-popup-float ml-float-3">
              <Briefcase size={16} color="#2563eb" />
              <span>Real-World Projects</span>
            </div>

            <div className="ml-popup-float ml-float-4">
              <Users size={16} color="#d97706" />
              <span>Industry Mentorship</span>
            </div>

            <div className="ml-popup-float ml-float-5">
              <Award size={16} color="#16a34a" />
              <span>Career Opportunities</span>
            </div>

            <div className="ml-popup-decoration-lines"></div>
          </div>
        </div>

        <div className="ml-popup-urgency">
          <span style={{ fontSize: '18px' }}>🔥</span> Applications are open for a <strong style={{ color: '#16a34a' }}>limited time</strong>. Don't miss this opportunity!
        </div>

      </div>
    </div>
  );
}
