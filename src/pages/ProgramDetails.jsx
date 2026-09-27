import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { programsData } from '../data/programsData';
import { buildCourseSchema } from '../utils/schemaBuilders';
import '../styles/ProgramDetails.css'; // Optional: We can inline styles or use existing classes

export default function ProgramDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);

  useEffect(() => {
    if (programsData[slug]) {
      setProgram(programsData[slug]);
    } else {
      navigate('/404');
    }
  }, [slug, navigate]);

  if (!program) return <div className="loading-container">Loading...</div>;

  const breadcrumbs = [
    { name: 'Home', url: 'https://www.learndepthacademy.com' },
    { name: 'Programs', url: 'https://www.learndepthacademy.com/programs' },
    { name: program.title, url: `https://www.learndepthacademy.com/programs/${slug}` }
  ];

  return (
    <main className="program-details-page">
      <SEOHead 
        title={program.seoTitle}
        description={program.description}
        canonicalUrl={`https://www.learndepthacademy.com/programs/${slug}`}
        schema={buildCourseSchema(program)}
        breadcrumbs={breadcrumbs}
      />
      
      <section className="program-hero">
        <div className="container">
          <h1>{program.title}</h1>
          <p className="program-desc">{program.description}</p>
          <div className="program-meta">
            <span><strong>Duration:</strong> {program.duration}</span>
            <span><strong>Mode:</strong> {program.mode}</span>
            <span><strong>Eligibility:</strong> {program.eligibility}</span>
          </div>
          <button className="cta-button" onClick={() => window.location.href = '/?program=' + slug + '#internship-form'}>
            Apply Now
          </button>
        </div>
      </section>

      <section className="program-technologies container">
        <h2>Technologies You Will Learn</h2>
        <ul className="tech-list">
          {program.technologies.map(tech => (
            <li key={tech} className="tech-item">{tech}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
