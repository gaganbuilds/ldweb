import React from 'react';
import { CheckCircle2, MessageCircle, Star, Sparkles, ShieldCheck } from 'lucide-react';
import styles from './CareerGuidanceSection.module.css';
import heroImage from '../assets/career_guidance_hero.jpg';

export default function CareerGuidanceSection() {
  return (
    <section className={styles.sectionWrapper}>
      
      {/* Decorative Wave Background */}
      <div className={styles.waveBackground} aria-hidden="true">
        <svg viewBox="0 0 1440 600" preserveAspectRatio="xMaxYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#f43f5e" fill="none" opacity="0.6">
            <path d="M500,-100 C700,200 1100,400 1500,600" strokeWidth="1" />
            <path d="M450,-100 C650,250 1150,450 1500,650" strokeWidth="0.8" />
            <path d="M400,-100 C600,300 1200,500 1500,700" strokeWidth="0.6" />
            <path d="M350,-100 C550,350 1250,550 1500,750" strokeWidth="0.4" />
            
            <path d="M800,-100 C900,100 1300,300 1500,400" strokeWidth="0.9" />
            <path d="M750,-100 C850,150 1350,350 1500,450" strokeWidth="0.7" />
            <path d="M700,-100 C800,200 1400,400 1500,500" strokeWidth="0.5" />
            
            <path d="M300,-100 C800,400 1400,200 1500,-50" strokeWidth="0.6" />
            <path d="M250,-100 C750,450 1450,250 1500,0" strokeWidth="0.4" />
            <path d="M200,-100 C700,500 1500,300 1500,50" strokeWidth="0.3" />
          </g>
        </svg>
      </div>

      <div className={styles.container}>
        
        {/* Left Content Column */}
        <div className={styles.leftColumn}>
          <div className={styles.eyebrow}>
            <ShieldCheck className={styles.eyebrowIcon} size={18} strokeWidth={2.5} />
            Your Bridge To The Tech Industry
          </div>

          <h2 className={styles.mainHeading}>
            Design Your <span className={styles.accentWord}>Tech Career</span>
          </h2>

          <p className={styles.description}>
            Stop guessing what the industry wants. Let our experts craft a personalized roadmap combining the right skills, projects, and internships to help you land your dream role.
          </p>

          <ul className={styles.checklist}>
            <li className={styles.checklistItem}>
              <CheckCircle2 className={styles.checkIcon} size={20} />
              1-on-1 Mentorship from Experts
            </li>
            <li className={styles.checklistItem}>
              <CheckCircle2 className={styles.checkIcon} size={20} />
              Tailored Internship & Job Roadmaps
            </li>
            <li className={styles.checklistItem}>
              <CheckCircle2 className={styles.checkIcon} size={20} />
              Resume & Portfolio Optimization
            </li>
          </ul>

          <a href="tel:9980855683" className={styles.ctaButton}>
            Book Free Strategy Call
          </a>

          <div className={styles.trustLine}>
            <Sparkles className={styles.sparkIcon} size={16} />
            Join 10,000+ students fast-tracking their careers
          </div>
        </div>

        {/* Right Images Column */}
        <div className={styles.rightColumn}>
          <img 
            src={heroImage} 
            alt="Students using LearnDepth platform" 
            className={styles.heroCompositeImg}
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
}
