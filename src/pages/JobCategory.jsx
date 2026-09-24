import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import JobListings from '../components/JobListings';
import Footer from '../components/Footer';

export default function JobCategory() {
  const { slug } = useParams();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <JobListings initialCategory={slug} />
      </main>
      <Footer />
    </div>
  );
}
