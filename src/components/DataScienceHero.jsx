import { useState } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import DataScienceStats from './DataScienceStats';
import DataScienceImageWall from './DataScienceImageWall';
import styles from './DataScienceHero.module.css';
import ProgramEnquiryModal from './ProgramEnquiryModal'; // reuse existing contact interaction

export default function DataScienceHero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className={styles.heroSection}>
      {/* Background Gradients & Patterns */}
      <div className={styles.bgGradient}></div>
      <div className={styles.bgPattern}></div>
      
      <div className={styles.heroContainer}>
        {/* Left Content */}
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            INDUSTRY-ALIGNED • PROJECT-BASED • CAREER-FOCUSED
          </div>
          
          <div className={styles.tagWrapper}>
            <span className={styles.tag}>DATA SCIENCE PROGRAM</span>
          </div>

          <h1 className={styles.title}>
            Data Science Program<br />
            with Internship &<br />
            <span className={styles.highlight}>100% Placement Assistance</span>
          </h1>

          {/* Curved Underline Element */}
          <div className={styles.underlineWrapper}>
            <svg viewBox="0 0 300 20" className={styles.underlineSVG} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 15Q150 -5 295 15" stroke="var(--brand-primary, #16A34A)" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          <p className={styles.description}>
            Build job-ready Data Science skills through practical learning, real-world projects, expert mentorship, internship experience, and career-focused placement assistance.
          </p>

          <DataScienceStats />

          <div className={styles.ctaGroup}>
            <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
              Talk to a Program Advisor <ArrowRight size={18} />
            </button>
            <a href="#curriculum" className={styles.secondaryBtn}>
              Download Curriculum <Download size={18} />
            </a>
          </div>
        </div>

        {/* Right Visual Wall */}
        <div className={styles.heroVisual}>
          <DataScienceImageWall />
        </div>
      </div>

      {isModalOpen && (
        <ProgramEnquiryModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          programName="Data Science Program"
        />
      )}
    </section>
  );
}
