import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './CareerCTASection.module.css';
import { Link } from 'react-router-dom';

export default function CareerCTASection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        
        {/* Left Side Content */}
        <div className={styles.leftContent}>
          <span className={styles.eyebrow}>FOR STUDENTS & PROFESSIONALS</span>
          
          <h2 className={styles.headline}>
            Build Skills.<br />
            Find Opportunities.<br />
            <span className={styles.accentText}>Grow Your Career.</span>
          </h2>
          
          <p className={styles.description}>
            Explore internships, job opportunities, industry projects, and career-focused opportunities designed to help you turn your skills into real-world experience.
          </p>
          
          <p className={styles.supportingLine}>
            From learning to getting industry-ready, discover opportunities that move your career forward.
          </p>
          
          <div className={styles.buttonGroup}>
            <Link to="/careers" className={styles.primaryBtn}>
              Explore Career Opportunities <ArrowRight size={18} />
            </Link>
            <Link to="/careers" className={styles.secondaryBtn}>
              View Open Positions
            </Link>
          </div>
        </div>

        {/* Right Side Visual */}
        <div className={styles.rightContent}>
          <div className={styles.visualContainer}>
            {/* Background Blob/Glow */}
            <div className={styles.glowBg}></div>
            
            {/* Main Image Card */}
            <div className={styles.imageCard}>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
                alt="Students collaborating" 
                className={styles.mainImage}
                loading="lazy"
              />
            </div>

            {/* Floating Cards */}
            <div className={`${styles.floatingCard} ${styles.card1}`}>
              <div className={styles.cardDot}></div>
              <div>
                <h4>Career Opportunities</h4>
                <p>Internships • Jobs • Projects</p>
              </div>
            </div>

            <div className={`${styles.floatingCard} ${styles.card2}`}>
              <div className={styles.cardDot} style={{ background: '#10b981' }}></div>
              <div>
                <h4>Industry Ready</h4>
                <p>Skills + Experience</p>
              </div>
            </div>

            <div className={`${styles.floatingCard} ${styles.card3}`}>
              <div className={styles.cardDot} style={{ background: '#3b82f6' }}></div>
              <div>
                <h4>Explore Opportunities</h4>
                <p>Find your next step</p>
              </div>
            </div>
            
            {/* Decorative Grid */}
            <div className={styles.decorativeGrid}></div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
