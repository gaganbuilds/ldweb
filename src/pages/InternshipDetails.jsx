import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import ProgramKeyHighlights from '../components/ProgramKeyHighlights';
import CurriculumSection from '../components/CurriculumSection';
import ProgramTechnologies from '../components/ProgramTechnologies';
import LMSPromoSection from '../components/LMSPromoSection';
import StudentSuccessGallery from '../components/StudentSuccessGallery';
import InternshipApplicationCTA from '../components/InternshipApplicationCTA';
import { internshipsData } from '../data/programsData';
import { buildCourseSchema } from '../utils/schemaBuilders';
import '../styles/MLInternshipHero.css';

export default function InternshipDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);

  useEffect(() => {
    if (internshipsData[slug]) {
      setInternship(internshipsData[slug]);
    } else {
      navigate('/404');
    }
  }, [slug, navigate]);

  if (!internship) return <div className="loading-container">Loading...</div>;

  const breadcrumbs = [
    { name: 'Home', url: 'https://www.learndepthacademy.com' },
    { name: 'Internships', url: 'https://www.learndepthacademy.com/internships' },
    { name: internship.title, url: `https://www.learndepthacademy.com/internships/${slug}` }
  ];

  if (slug === 'machine-learning') {
    return (
      <>
        <Navbar />
        <main className="internship-details-page">
        <SEOHead 
          title={internship.seoTitle}
          description={internship.description}
          canonicalUrl={`https://www.learndepthacademy.com/internships/${slug}`}
          schema={buildCourseSchema(internship)}
          breadcrumbs={breadcrumbs}
        />
        
        <section className="ml-hero-section">
          <div className="ml-hero-bg"></div>
          <div className="ml-hero-overlay"></div>
          <div className="ml-hero-green-tint"></div>
          
          <div className="ml-hero-container">
            <div className="ml-hero-left">
              <div className="ml-hero-label">
                <span className="ml-hero-label-dot"></span>
                Machine Learning Internship Program
              </div>
              
              <h1 className="ml-hero-title">
                Build Real-World <br/>
                <span className="ml-hero-title-highlight">Machine Learning Skills</span>
              </h1>
              
              <h2 className="ml-hero-subtitle">From Data to Intelligent Models</h2>
              
              <p className="ml-hero-desc">
                Learn Python, data analysis, machine learning algorithms, model building and deployment through hands-on projects, mentor guidance and practical industry-oriented learning.
              </p>
              
              <div className="ml-hero-card">
                <div className="ml-hero-card-title">Machine Learning Focus</div>
                <ul className="ml-hero-card-list">
                  <li className="ml-hero-card-item">
                    <span className="ml-hero-check">✓</span> Python + Data Analysis
                  </li>
                  <li className="ml-hero-card-item">
                    <span className="ml-hero-check">✓</span> ML Model Building
                  </li>
                  <li className="ml-hero-card-item">
                    <span className="ml-hero-check">✓</span> Real-World Projects
                  </li>
                </ul>
              </div>
              
              <div className="ml-hero-info-row">
                <div className="ml-hero-info-item">
                  <span className="ml-hero-info-label">Internship Mode</span>
                  <span className="ml-hero-info-value">{internship.mode}</span>
                </div>
                <div className="ml-hero-info-item">
                  <span className="ml-hero-info-label">Duration</span>
                  <span className="ml-hero-info-value">{internship.duration}</span>
                </div>
                <div className="ml-hero-info-item">
                  <span className="ml-hero-info-label">Certificate</span>
                  <span className="ml-hero-info-value">On Successful Completion</span>
                </div>
                <div className="ml-hero-info-item">
                  <span className="ml-hero-info-label">Batch</span>
                  <span className="ml-hero-info-value">Admissions Open</span>
                </div>
              </div>
              
              <div className="ml-hero-actions">
                <button 
                  className="ml-hero-btn-primary"
                  onClick={() => window.location.href = '/?program=' + slug + '#internship-form'}
                >
                  Apply for ML Internship →
                </button>
                <button 
                  className="ml-hero-btn-secondary"
                  onClick={() => {
                    const detailsSection = document.getElementById('details-section');
                    if (detailsSection) detailsSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Program Details
                </button>
              </div>
            </div>
            
            <div className="ml-hero-right">
              {/* Floating images and badges removed because they are now natively baked into the new full-bleed ML hero background image */}
            </div>
          </div>
        </section>

        <ProgramKeyHighlights />
        <ProgramTechnologies />
        <CurriculumSection />

        <StudentSuccessGallery />

        <InternshipApplicationCTA />

        <LMSPromoSection />
      </main>
      <Footer />
      </>
    );
  }

  // Default layout for other internships
  return (
    <>
      <Navbar />
      <main className="internship-details-page" style={{ paddingTop: '80px', minHeight: '80vh' }}>
      <SEOHead 
        title={internship.seoTitle}
        description={internship.description}
        canonicalUrl={`https://www.learndepthacademy.com/internships/${slug}`}
        schema={buildCourseSchema(internship)}
        breadcrumbs={breadcrumbs}
      />
      
      <section className="internship-hero" style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#0f172a' }}>{internship.title}</h1>
          <p className="internship-desc" style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '24px' }}>{internship.description}</p>
          <div className="internship-meta" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
            <span><strong>Duration:</strong> {internship.duration}</span>
            <span><strong>Mode:</strong> {internship.mode}</span>
            <span><strong>Eligibility:</strong> {internship.eligibility}</span>
          </div>
          <button 
            className="cta-button" 
            style={{ padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' }}
            onClick={() => window.location.href = '/?program=' + slug + '#internship-form'}
          >
            Apply for Internship
          </button>
        </div>
      </section>

      <section className="internship-technologies container" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#1e293b' }}>Technologies You Will Use</h2>
        <ul className="tech-list" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', listStyle: 'none', padding: 0 }}>
          {internship.technologies.map(tech => (
            <li key={tech} className="tech-item" style={{ background: '#e2e8f0', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', color: '#334155' }}>{tech}</li>
          ))}
        </ul>
      </section>
    </main>
    <Footer />
    </>
  );
}
