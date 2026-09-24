import React from 'react';
import styles from './InternshipCTA.module.css';

const internshipHighlights = [
  "Learning",
  "Building",
  "Mentorship",
  "Project Complete"
];

const learnerMessages = [
  { id: 1, text: '"Finally got hands-on experience through an internship."', styleClass: styles.posBubble1 },
  { id: 2, text: '"Working on a real project made learning much easier."', styleClass: styles.posBubble2 },
  { id: 3, text: '"Built something I can actually showcase in my portfolio."', styleClass: styles.posBubble3 },
];

export default function InternshipCTA() {
  return (
    <section className={styles.sectionWrapper} aria-label="Internship Programs CTA">
      <div className={styles.container}>
        
        {/* LEFT COLUMN - Content */}
        <div className={styles.leftColumn}>
          <span className={styles.eyebrow}>INTERNSHIP PROGRAMS</span>
          
          <h2 className={styles.heading}>
            Build Real-World Experience.<br />
            <span className={styles.accentText}>Become Industry Ready.</span>
          </h2>
          
          <p className={styles.description}>
            Gain practical experience through structured internships, real-world projects, guided learning and career-focused opportunities designed to help you build skills that matter.
          </p>
          
          <div className={styles.ctaWrapper}>
            <a 
              href="#internship-form" 
              className={styles.ctaBtn}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('internship-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Internship Programs
            </a>
            <span className={styles.ctaSubtext}>
              Explore AI, Data Science, Web Development, App Development and more.
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN - Floating Visual Composition */}
        <div className={styles.rightColumn} aria-hidden="true">
          
          {/* Messages */}
          {learnerMessages.map((msg) => (
            <div key={msg.id} className={`${styles.floatingBubble} ${msg.styleClass}`}>
              {msg.text}
            </div>
          ))}

          {/* Avatars */}
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300&h=300&auto=format&fit=crop" 
            alt="Student" 
            className={`${styles.avatar} ${styles.posAvatar1}`} 
            loading="lazy"
          />
          
          <img 
            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=300&h=300&auto=format&fit=crop" 
            alt="Student Learner" 
            className={`${styles.avatar} ${styles.posAvatar2}`} 
            loading="lazy"
          />

          <img 
            src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=300&h=300&auto=format&fit=crop" 
            alt="Student Intern" 
            className={`${styles.avatar} ${styles.posAvatar3}`} 
            loading="lazy"
          />

          {/* Floating UI Card */}
          <div className={styles.uiCard}>
            <div className={styles.uiCardTitle}>
              <span>INTERNSHIP PROGRESS</span>
              <span className={styles.uiCardFraction}>4 / 4</span>
            </div>
            <div className={styles.uiCardList}>
              {internshipHighlights.map((item, index) => (
                <div key={index} className={styles.uiCardItem}>
                  <div className={styles.uiCardDot}></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
