import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function NotFound() {
  return (
    <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
      <SEOHead 
        title="Page Not Found | LearnDepth Academy"
        description="The page you are looking for does not exist."
        robots="noindex, nofollow"
      />
      <h1 style={{ fontSize: '4rem', color: '#2563eb', marginBottom: '16px' }}>404</h1>
      <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '16px' }}>Page Not Found</h2>
      <p style={{ color: '#475569', marginBottom: '32px', maxWidth: '500px' }}>
        Sorry, the page you're looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
          Go to Homepage
        </Link>
        <Link to="/careers" style={{ padding: '10px 20px', background: '#e2e8f0', color: '#0f172a', textDecoration: 'none', borderRadius: '6px' }}>
          Explore Careers
        </Link>
        <Link to="/about" style={{ padding: '10px 20px', background: '#e2e8f0', color: '#0f172a', textDecoration: 'none', borderRadius: '6px' }}>
          About Us
        </Link>
      </div>
    </main>
  );
}
