import React from 'react';
import Navbar from '../components/Navbar';
import CareersHero from '../components/CareersHero';
import JobCategoriesSection from '../components/JobCategoriesSection';
import JobListings from '../components/JobListings';
import Footer from '../components/Footer';

export default function Careers() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
