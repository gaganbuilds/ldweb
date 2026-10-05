import React from 'react';
import '../styles/LMSPromoSection.css';

export default function LMSPromoSection() {
  return (
    <section className="ld-lms-promo-section">
      <div className="ld-lms-promo-container">
        
        <div className="ld-lms-promo-header">
          <h2 className="ld-lms-promo-title">
            Step Into Your Learning <span className="ld-lms-promo-highlight">Dashboard</span>
          </h2>
          <p className="ld-lms-promo-subtitle">
            Learn, practice, track your progress and build real-world skills — all in one place.
          </p>
        </div>

        <div className="ld-lms-promo-benefits">
          <div className="ld-lms-benefit-item">
            <svg className="ld-lms-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Real-World Projects</span>
          </div>
          <div className="ld-lms-benefit-item">
            <svg className="ld-lms-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Hands-on Learning Experience</span>
          </div>
          <div className="ld-lms-benefit-item">
            <svg className="ld-lms-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Instant Doubt Resolution</span>
          </div>
        </div>

        <div className="ld-lms-promo-cta-wrapper">
          <button className="ld-lms-promo-cta">
            Explore LearnDepth LMS
          </button>
        </div>

        <div className="ld-lms-promo-showcase">
          <div className="ld-lms-glow-backdrop"></div>
          <div className="ld-lms-image-wrapper">
            <img 
              src="/images/lms.png" 
              alt="LearnDepth Academy LMS student learning dashboard" 
              className="ld-lms-image"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
