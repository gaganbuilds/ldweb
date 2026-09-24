import React from 'react';
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
