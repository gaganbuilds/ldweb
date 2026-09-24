import { useState, useEffect } from 'react';
import HeroAnnouncement from './HeroAnnouncement';
import HeroActions from './HeroActions';
import HeroMetricCards from './HeroMetricCards';
import HeroVisual from './HeroVisual';
import styles from './Hero.module.css';

const DOMAINS = [
  'Data Science',
  'Machine Learning',
  'Artificial Intelligence',
  'Full Stack Development',
  'DSA & Problem Solving',
  'Web Development',
  'Generative AI',
  'Python Development'
];

export default function Hero() {
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDomainIndex((prev) => (prev + 1) % DOMAINS.length);
    }, 2500); // 2.5 seconds per domain
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBackground}>
        <div className={styles.radialGlow}></div>
      </div>
      
      <div className={styles.heroContainer}>
        {/* Left Column - Content */}
        <div className={styles.heroContent}>
          <HeroAnnouncement />
          
          <h1 className={styles.heroHeading}>
            <span className={styles.headingLine}>Build Skills in</span>
            <span className={styles.headingHighlightWrapper}>
              {DOMAINS.map((domain, index) => {
                let positionClass = styles.nextDomain;
                if (index === currentDomainIndex) {
                  positionClass = styles.activeDomain;
                } else if (index === (currentDomainIndex - 1 + DOMAINS.length) % DOMAINS.length) {
                  positionClass = styles.prevDomain;
                }
                return (
                  <span 
                    key={domain} 
                    className={`${styles.headingHighlight} ${positionClass}`}
                  >
                    {domain}
                  </span>
                );
              })}
            </span>
          </h1>
          
          <p className={styles.heroDescription}>
            Build practical skills through industry-aligned learning, real-world projects, mentorship, internships and career-focused programs designed to help you become industry ready.
          </p>
          
          <HeroActions />
          <HeroMetricCards />
        </div>
        
        {/* Right Column - Visual */}
        <div className={styles.heroVisualArea}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
