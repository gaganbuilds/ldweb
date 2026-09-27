import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { internshipsData } from '../data/programsData';
import { buildCourseSchema } from '../utils/schemaBuilders';

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

  return (
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
  );
}
