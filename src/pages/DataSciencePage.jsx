import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import DataScienceHero from '../components/DataScienceHero';
import DataScienceAbout from '../components/DataScienceAbout';
import PartnerInstitutes from '../components/PartnerInstitutes';

export default function DataSciencePage() {
  return (
    <>
      <SEOHead 
        title="Data Science Program | LearnDepth Academy"
        description="Build job-ready Data Science skills through practical learning, real-world projects, expert mentorship, internship experience, and career-focused placement assistance."
        canonicalUrl="https://www.learndepthacademy.com/data-science"
      />
      <Navbar />
      <main>
        <DataScienceHero />
        <DataScienceAbout />
        <PartnerInstitutes />
      </main>
      <Footer />
    </>
  );
}
