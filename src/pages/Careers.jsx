import React from 'react';
import SEOHead from '../components/SEOHead';
import { buildOrganizationSchema } from '../utils/schemaBuilders';
import Navbar from '../components/Navbar';
import CareersHero from '../components/CareersHero';
import JobCategoriesSection from '../components/JobCategoriesSection';
import JobListings from '../components/JobListings';
import Footer from '../components/Footer';

export default function Careers() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SEOHead 
        title="Careers at LearnDepth Academy | Jobs & Opportunities"
        description="Explore job opportunities and careers at LearnDepth Academy. Join our team to help build the future of technology education and career development."
        canonicalUrl="https://www.learndepthacademy.com/careers"
        schema={buildOrganizationSchema()}
      />
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <CareersHero />
        <JobCategoriesSection />
        <JobListings />
      </main>
      <Footer />
    </div>
  );
}
