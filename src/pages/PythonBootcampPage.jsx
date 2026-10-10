import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import PythonBootcampHighlights from '../components/PythonBootcampHighlights';
import PythonBootcampCurriculum from '../components/PythonBootcampCurriculum';
import PythonBootcampValueStack from '../components/PythonBootcampValueStack';
import StudentSuccessGallery from '../components/StudentSuccessGallery';
import PythonBootcampApplicationCTA from '../components/PythonBootcampApplicationCTA';
import LMSPromoSection from '../components/LMSPromoSection';
import '../styles/MLInternshipHero.css'; // Reusing hero layout

export default function PythonBootcampPage() {
  const { hash } = useLocation();

  // Handle Hash Scrolling
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const breadcrumbs = [
    { name: 'Home', url: 'https://www.learndepthacademy.com' },
    { name: 'Python Bootcamp', url: 'https://www.learndepthacademy.com/python-bootcamp' }
  ];

  return (
    <>
      <Navbar />
      <main className="internship-details-page">
        <SEOHead 
          title="30-Day Python Bootcamp for Students | LearnDepth Academy"
          description="Learn practical Python, APIs, automation, GitHub, projects and internship preparation in 30 days with LearnDepth Academy. Join the launch program for ₹399."
          canonicalUrl="https://www.learndepthacademy.com/python-bootcamp"
          breadcrumbs={breadcrumbs}
        />
        
        <section className="ml-hero-section">
          {/* Reusing ML hero styling classes for consistent layout */}
          <div className="ml-hero-bg"></div>
          <div className="ml-hero-overlay"></div>
          <div className="ml-hero-green-tint"></div>
          
          <div className="ml-hero-container">
            <div className="ml-hero-left">
              <div className="ml-hero-label">
                <span className="ml-hero-label-dot"></span>
                30-DAY PYTHON BOOTCAMP
              </div>
              
              <h1 className="ml-hero-title">
                Learn Python the Way <br/>
                <span className="ml-hero-title-highlight">Companies Expect You to Use It.</span>
              </h1>
              
              <h2 className="ml-hero-subtitle">Build Projects. Get Internship-Ready.</h2>
              
              <p className="ml-hero-desc">
                Learn practical Python, work with APIs, automate real-world tasks, build a professional GitHub profile, and prepare for internship applications—all through a focused 30-day learning sprint.
              </p>
              
              <div className="ml-hero-card">
                <div className="ml-hero-card-title">Launch Price: ₹399</div>
                <ul className="ml-hero-card-list">
                  <li className="ml-hero-card-item">
                    <span className="ml-hero-check">✓</span> One-time payment
                  </li>
                  <li className="ml-hero-card-item">
                    <span className="ml-hero-check">✓</span> 30-day guided learning journey
                  </li>
                </ul>
              </div>
              
              <div className="ml-hero-info-row">
                <div className="ml-hero-info-item">
                  <span className="ml-hero-info-label">Mode</span>
                  <span className="ml-hero-info-value">Online & Guided</span>
                </div>
                <div className="ml-hero-info-item">
                  <span className="ml-hero-info-label">Duration</span>
                  <span className="ml-hero-info-value">30 Days</span>
                </div>
                <div className="ml-hero-info-item">
                  <span className="ml-hero-info-label">Certificate</span>
                  <span className="ml-hero-info-value">On Successful Completion</span>
                </div>
              </div>
              
              <div className="ml-hero-actions">
                <button 
                  className="ml-hero-btn-primary"
                  onClick={() => {
                    const formSection = document.getElementById('python-bootcamp-form');
                    if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Join the Python Bootcamp — ₹399 →
                </button>
                <button 
                  className="ml-hero-btn-secondary"
                  onClick={() => {
                    const detailsSection = document.getElementById('curriculum-section');
                    if (detailsSection) detailsSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore the Curriculum
                </button>
              </div>
            </div>
            
            <div className="ml-hero-right">
              {/* Native background image takes care of visual */}
            </div>
          </div>
        </section>

        <PythonBootcampHighlights />
        <PythonBootcampCurriculum />
        <PythonBootcampValueStack />
        <StudentSuccessGallery />
        <PythonBootcampApplicationCTA />
        <LMSPromoSection />

      </main>
      <Footer />
    </>
  );
}
