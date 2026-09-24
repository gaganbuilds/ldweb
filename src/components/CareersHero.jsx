import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './CareersHero.module.css';

export default function CareersHero() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Basic animation for entry
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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <section className={styles.heroSection} ref={containerRef}>
      
      {/* Abstract Background Effects */}
      <div className={styles.bgEffects}>
        <div className={styles.glowTop}></div>
        <div className={styles.glowBottom}></div>
      </div>

      <div className={styles.container}>
        
        {/* Top Text Content */}
        <div className={styles.heroTextContent}>
          
          {/* Floating UI Notification Chips */}
          <div className={styles.chipsMobileWrapper}>
            <div className={`${styles.floatingChip} ${styles.chipLeft}`}>
              <span className={styles.statusDot}></span>
              <span className={styles.chipText}><strong>Interview booked</strong> · just now</span>
            </div>

            <div className={`${styles.floatingChip} ${styles.chipRightTop}`}>
              <span className={styles.statusDot} style={{ background: '#3b82f6' }}></span>
              <span className={styles.chipText}><strong>Application received</strong> · today</span>
            </div>

            <div className={`${styles.floatingChip} ${styles.chipRightBottom}`}>
              <span className={styles.statusDot} style={{ background: '#f43f5e' }}></span>
              <span className={styles.chipText}><strong>New opportunity</strong> · just now</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className={styles.headline}>
            <span className={styles.headlineDark}>Build Your Career</span><br />
            <span className={styles.headlineAccent}>with LearnDepth.</span>
          </h1>

          <p className={styles.description}>
            Join a team building practical learning experiences, technology, and opportunities that help people move closer to their careers.
          </p>
        </div>

        {/* Feature Cards Container */}
        <div className={styles.cardsContainer}>
          
          {/* Card 1: For Candidates (Dark) */}
          <div className={`${styles.featureCard} ${styles.darkCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEyebrow}>FOR CANDIDATES</span>
            </div>
            
            <h2 className={styles.cardTitle}>
              Find your <span className={styles.cardAccentLighter}>next opportunity.</span>
            </h2>
            
            <p className={styles.cardDesc}>
              Explore roles at LearnDepth where you can work on meaningful products, collaborate with a growing team, and build skills that create real-world impact.
            </p>
            
            <Link to="/careers/jobs" className={`${styles.cardBtn} ${styles.btnPrimary}`}>
              View Open Positions <ArrowRight size={18} />
            </Link>
          </div>

          {/* Card 2: For Employers (Light) */}
          <div className={`${styles.featureCard} ${styles.lightCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEyebrow}>FOR EMPLOYERS</span>
            </div>
            
            <h2 className={styles.cardTitle}>
              Build your <span className={styles.cardAccent}>next team.</span>
            </h2>
            
            <p className={styles.cardDesc}>
              Looking for skilled, motivated talent? Connect with LearnDepth to explore opportunities for hiring, collaboration, and industry engagement.
            </p>
            
            <Link to="/contact" className={`${styles.cardBtn} ${styles.btnSecondary}`}>
              Partner With Us <ArrowRight size={18} />
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
}
