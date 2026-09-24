import React from 'react';
import { BookOpen, Building2 } from 'lucide-react';
import styles from './AboutImpact.module.css';

export default function AboutImpact() {
  const stats = [
    { value: '7,000+', label: 'Students Trained' },
    { value: '40+', label: 'Programs & Learning Initiatives' },
    { value: '25+', label: 'Institutional / Industry Collaborations' },
    { value: 'Multiple Domains', label: 'Technology & Career-Focused Learning' },
  ];

  return (
    <section className={styles.impactSection}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.container}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <div className={styles.eyebrow}>LEARNING • TECHNOLOGY • CAREER</div>
          <h2 className={styles.heading}>
            Building Skills.<br />
            <span className={styles.highlight}>Creating Opportunities.</span><br />
            Shaping Careers.
          </h2>
          <p className={styles.description}>
            LearnDepth is building an industry-focused learning ecosystem that helps students and professionals develop practical skills, gain real-world exposure, and prepare for meaningful career opportunities.
          </p>

          <div className={styles.audienceBlocks}>
            <div className={styles.audienceBlock}>
              <div className={styles.iconContainer}>
                <BookOpen size={24} color="var(--text-accent)" />
              </div>
              <h3 className={styles.audienceTitle}>For Learners</h3>
              <p className={styles.audienceDesc}>
                Practical learning experiences designed to help students build skills, projects, confidence, and career readiness.
              </p>
              <ul className={styles.bulletList}>
                <li>Industry-aligned technical programs</li>
                <li>Hands-on projects and practical learning</li>
                <li>Internships and real-world exposure</li>
                <li>Career-focused skill development</li>
                <li>Mentorship and learning support</li>
              </ul>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.audienceBlock}>
              <div className={styles.iconContainer}>
                <Building2 size={24} color="var(--text-accent)" />
              </div>
              <h3 className={styles.audienceTitle}>For Organizations</h3>
              <p className={styles.audienceDesc}>
                Technology-enabled learning and talent solutions designed to connect organizations with skilled, career-ready talent.
              </p>
              <ul className={styles.bulletList}>
                <li>Industry-focused training solutions</li>
                <li>Talent and internship programs</li>
                <li>Campus and institutional partnerships</li>
                <li>Skill development initiatives</li>
                <li>Technology and AI-enabled learning solutions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Stats Ticker */}
        <div className={styles.rightColumn}>
          <div className={styles.tickerWrapper}>
            <div className={styles.tickerTrack}>
              {/* Duplicate list to create seamless infinite loop */}
              {[...stats, ...stats, ...stats].map((stat, i) => (
                <div key={i} className={styles.statCard}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
