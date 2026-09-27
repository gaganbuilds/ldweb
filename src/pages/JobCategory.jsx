import React from 'react';
import { useParams } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';
import JobListings from '../components/JobListings';
import Footer from '../components/Footer';

export default function JobCategory() {
  const { slug } = useParams();
  
  const categoryName = slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Category';

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SEOHead 
        title={`${categoryName} Jobs | LearnDepth Academy`}
        description={`Browse open ${categoryName} positions at LearnDepth Academy. Join our team today.`}
        canonicalUrl={`https://www.learndepthacademy.com/careers/category/${slug}`}
      />
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <JobListings initialCategory={slug} />
      </main>
      <Footer />
    </div>
  );
}
