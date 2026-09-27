import Navbar from '../components/Navbar';
import SEOHead from '../components/SEOHead';
import { buildWebSiteSchema, buildOrganizationSchema } from '../utils/schemaBuilders';
import TopAnnouncementBar from '../components/TopAnnouncementBar';
import Hero from '../components/Hero';
import InternshipLeadSection from '../components/InternshipLeadSection';
import PartnerInstitutes from '../components/PartnerInstitutes';
import CareerJourneySection from '../components/CareerJourneySection';
import HiringStatisticsSection from '../components/HiringStatisticsSection';
import IndustryCoursesSection from '../components/IndustryCoursesSection';
import AIWorkshopCTA from '../components/AIWorkshopCTA';
import LearnerJourney from '../components/LearnerJourney';
import InternshipCTA from '../components/InternshipCTA';
import LearnerTestimonials from '../components/LearnerTestimonials';
import BlogSlider from '../components/BlogSlider';
import CareerGuidanceSection from '../components/CareerGuidanceSection';
import CareerCTASection from '../components/CareerCTASection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <SEOHead 
        title="LearnDepth Academy | Industry-Ready Courses, Internships & Career Programs"
        description="LearnDepth Academy helps students and professionals build industry-ready skills through technology courses, internships, mentorship, workshops and career-focused programs."
        canonicalUrl="https://www.learndepthacademy.com"
        schema={[buildWebSiteSchema(), buildOrganizationSchema()]}
      />
      <Navbar />
      <TopAnnouncementBar />
      <main>
        <Hero />
        <InternshipLeadSection />
        <PartnerInstitutes />
        <CareerJourneySection />
        <LearnerJourney />
        <IndustryCoursesSection />
        <HiringStatisticsSection />
        <AIWorkshopCTA />
        <InternshipCTA />
        <LearnerTestimonials />
        <BlogSlider />
        <FAQSection page="home" />
        <CareerGuidanceSection />
        <CareerCTASection />
      </main>
      <Footer />
    </>
  );
}
