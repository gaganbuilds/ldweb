import React from 'react';
import styles from './AboutHero.module.css';
import aboutImage from '../assets/about_hero.jpg';

export default function AboutHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        {/* Left Content Area */}
        <div className={styles.textContent}>
          <div className={styles.eyebrow}>
            ABOUT LEARN DEPTH
          </div>
          <h1 className={styles.heading}>
            <span className={styles.headingHighlight}>Empowering Learners</span><br />
            to Build Skills<br />
            That Shape the Future
          </h1>
          <p className={styles.description}>
            At Learn Depth Academy, we are building a practical learning ecosystem that helps students and aspiring professionals develop the skills needed for the real world. Through industry-aligned programs, hands-on learning, mentorship, internships and technology-driven education, we make complex concepts easier to understand and practical skills easier to build.
          </p>
          <p className={styles.description}>
            Our focus spans Artificial Intelligence, Machine Learning, Data Science, Full Stack Development, Programming, emerging technologies and career-focused learning — helping learners move from simply learning concepts to actually building with them.
          </p>
        </div>

        {/* Right Image Area */}
        <div className={styles.imageContent}>
          <div className={styles.imageWrapper}>
            <img 
              src={aboutImage} 
              alt="Diverse students and professionals collaborating at Learn Depth" 
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
