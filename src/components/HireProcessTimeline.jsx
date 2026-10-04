import { useEffect, useRef } from 'react';
import styles from './HireProcessTimeline.module.css';

const hiringSteps = [
  {
    id: "01",
    title: "Connect With Our Hiring Team",
    description: "Start with a quick conversation with our team to understand your hiring needs, role requirements, and the kind of talent you are looking for."
  },
  {
    id: "02",
    title: "Share Your Hiring Requirements",
    description: "Tell us about the role, required skills, experience level, technology stack, and other expectations for the position."
  },
  {
    id: "03",
    title: "Meet Shortlisted Candidates",
    description: "Our team helps identify suitable candidates based on the role requirements, skills, projects, and practical experience. You can then evaluate and interview the shortlisted candidates."
  },
  {
    id: "04",
    title: "Interview, Select & Hire",
    description: "Conduct your interviews, evaluate the candidates, and select the right fit for your team. Our team can coordinate the process and support you through the next steps."
  }
];

export default function HireProcessTimeline() {
  const observerRef = useRef(null);

  useEffect(() => {
    // Only use IntersectionObserver if the user does not prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      const elements = document.querySelectorAll(`.${styles.timelineItem}`);
      elements.forEach(el => el.classList.add(styles.animateReveal));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animateReveal);
            // Once revealed, we don't need to observe it anymore for a simple fade-in
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    
    observerRef.current = observer;
    
    const elements = document.querySelectorAll(`.${styles.timelineItem}`);
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      if (observerRef.current) {
        elements.forEach((el) => observerRef.current.unobserve(el));
      }
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headingWrapper}>
          <h2 className={styles.heading}>
            How It <span className={styles.highlight}>Works</span>
          </h2>
          <p className={styles.subtitle}>
            A simple process to connect with skilled, industry-ready talent.
          </p>
        </div>

        <div className={styles.timelineContainer}>
          <div className={styles.timelineLine}></div>
          
          {hiringSteps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div 
                key={step.id} 
                className={`${styles.timelineItem} ${isLeft ? styles.left : styles.right}`}
              >
                <div className={styles.timelineContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
                
                <div className={styles.timelineNode}>
                  <div className={styles.innerDot}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
