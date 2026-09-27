import React from 'react';
import SEOHead from '../components/SEOHead';
import { buildLocalBusinessSchema } from '../utils/schemaBuilders';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutHero from '../components/AboutHero';
import AboutImpact from '../components/AboutImpact';
import PartnerInstitutes from '../components/PartnerInstitutes';
import WhyLearnDepth from '../components/WhyLearnDepth';
import FAQSection from '../components/FAQSection';

export default function AboutUs() {
  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SEOHead 
        title="About LearnDepth Academy | Technology Education & Career Development"
        description="LearnDepth Academy is an EdTech organization in Mysuru offering data science, machine learning, and full stack development courses, internships, and career programs."
        canonicalUrl="https://www.learndepthacademy.com/about"
        schema={buildLocalBusinessSchema()}
      />
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <AboutHero />
        <AboutImpact />
        <PartnerInstitutes />
        <WhyLearnDepth />
        <FAQSection page="about" />
      </main>
      <Footer />
    </div>
  );
}
