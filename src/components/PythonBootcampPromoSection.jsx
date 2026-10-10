import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, Rocket, Briefcase, 
  Calendar, Users, Star, PlayCircle 
} from 'lucide-react';
import '../styles/PythonBootcampPromoSection.css';
import studentImg from '../assets/generated_student.jpg';

export default function PythonBootcampPromoSection() {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/python-bootcamp');
  };

  const handleWatchOverview = () => {
    // Navigate to the same page but scroll to the curriculum/video section if it exists
    navigate('/python-bootcamp');
  };

  return (
    <section className="pb-promo-section" aria-label="Python Bootcamp Promotion">
      <div className="pb-promo-container">
        
        {/* Background Decorative Elements */}
        <div className="pb-promo-decor pb-promo-blob-1" aria-hidden="true"></div>
        <div className="pb-promo-decor pb-promo-dashed-line" aria-hidden="true"></div>
        <div className="pb-promo-decor pb-promo-motion-strokes" aria-hidden="true">
          <div className="pb-promo-stroke"></div>
          <div className="pb-promo-stroke"></div>
          <div className="pb-promo-stroke"></div>
        </div>

        {/* Left Side Content */}
        <div className="pb-promo-left">
          <div className="pb-promo-badge">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" 
              alt="Python Logo" 
            />
            30-Day Python Bootcamp
          </div>

          <h2 className="pb-promo-heading">
            Learn Python.<br/>
            <span className="pb-promo-heading-accent">Build Real Projects.</span>
          </h2>

          <p className="pb-promo-desc">
            Get industry-ready with practical Python skills, work on real projects and prepare to crack an internship in just 30 days.
          </p>

          <div className="pb-promo-features">
            <div className="pb-promo-feature-item">
              <div className="pb-promo-feature-icon-wrapper">
                <Code size={24} strokeWidth={2.5} />
              </div>
              <span className="pb-promo-feature-label">Python From Scratch</span>
            </div>
            
            <div className="pb-promo-feature-separator"></div>
            
            <div className="pb-promo-feature-item">
              <div className="pb-promo-feature-icon-wrapper">
                <Rocket size={24} strokeWidth={2.5} />
              </div>
              <span className="pb-promo-feature-label">Hands-on Projects</span>
            </div>

            <div className="pb-promo-feature-separator"></div>

            <div className="pb-promo-feature-item">
              <div className="pb-promo-feature-icon-wrapper">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" width="24" height="24" />
              </div>
              <span className="pb-promo-feature-label">Git &<br/>GitHub</span>
            </div>

            <div className="pb-promo-feature-separator"></div>

            <div className="pb-promo-feature-item">
              <div className="pb-promo-feature-icon-wrapper">
                <Briefcase size={24} strokeWidth={2.5} />
              </div>
              <span className="pb-promo-feature-label">Internship Preparation</span>
            </div>
          </div>

          <div className="pb-promo-ctas">
            <button className="pb-promo-btn-primary" onClick={handleJoinClick}>
              Join the Python Bootcamp — ₹399 →
            </button>
            <button className="pb-promo-btn-secondary" onClick={handleWatchOverview}>
              <PlayCircle size={20} /> Watch Overview
            </button>
          </div>

          <div className="pb-promo-info-row">
            <div className="pb-promo-info-item">
              <Calendar size={20} className="pb-promo-info-icon" />
              <div className="pb-promo-info-text">
                <span>30 Days</span>
                <span>Learning Sprint</span>
              </div>
            </div>
            
            <div className="pb-promo-feature-separator" style={{ height: '30px', margin: '0 10px' }}></div>
            
            <div className="pb-promo-info-item">
              <Users size={20} className="pb-promo-info-icon" />
              <div className="pb-promo-info-text">
                <span>Live Weekly</span>
                <span>Mega-Webinar</span>
              </div>
            </div>

            <div className="pb-promo-feature-separator" style={{ height: '30px', margin: '0 10px' }}></div>

            <div className="pb-promo-info-item">
              <Star size={20} className="pb-promo-info-icon" />
              <div className="pb-promo-info-text">
                <span>Project-Driven</span>
                <span>Curriculum</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Image & Cards */}
        <div className="pb-promo-right">
          <img 
            src={studentImg} 
            alt="Student working on Python projects" 
            className="pb-promo-student-img" 
            width="500" 
            height="550"
          />

          {/* Floating Cards */}
          <div className="pb-promo-card pb-promo-card-top-right">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" 
              alt="" 
              className="pb-promo-card-icon"
            />
            <span className="pb-promo-card-text">Python<br/>Skills</span>
          </div>

          <div className="pb-promo-card pb-promo-card-mid-left">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" className="pb-promo-card-icon" />
            <span className="pb-promo-card-text">Build<br/>Projects</span>
          </div>

          <div className="pb-promo-card pb-promo-card-mid-right">
            <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center' }}>
              <Briefcase size={32} />
            </div>
            <span className="pb-promo-card-text">Get Internship<br/>Ready</span>
          </div>

          {/* Price Card */}
          <div className="pb-promo-price-card">
            <div className="pb-promo-price-label">Launch Price</div>
            <div className="pb-promo-price-value">₹399</div>
            <div className="pb-promo-price-strike">₹3,997</div>
            <div className="pb-promo-price-accent"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
