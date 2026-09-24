import React, { useState, useEffect } from 'react';
import { GraduationCap, Laptop, Briefcase, Users, Award, Building, Network, Rocket, ArrowRight, Phone } from 'lucide-react';
import styles from './WhyLearnDepth.module.css';

const features = [
  { id: 1, angle: 0, icon: GraduationCap, title: "Industry-Aligned Learning", desc: "Learn skills that reflect real industry requirements." },
  { id: 2, angle: 45, icon: Laptop, title: "Practical & Project-Based", desc: "Build real projects instead of learning only through theory." },
  { id: 3, angle: 90, icon: Briefcase, title: "Career-Focused Programs", desc: "Develop skills with a clear path toward career readiness." },
  { id: 4, angle: 135, icon: Users, title: "Mentorship & Guidance", desc: "Learn with structured guidance and support throughout your journey." },
  { id: 5, angle: 180, icon: Award, title: "Recognized Learning", desc: "Showcase your learning through projects, certificates and experience." },
  { id: 6, angle: 225, icon: Building, title: "Internship Opportunities", desc: "Gain practical exposure through internships and real-world assignments." },
  { id: 7, angle: 270, icon: Network, title: "Learning Community", desc: "Connect, collaborate and grow alongside other ambitious learners." },
  { id: 8, angle: 315, icon: Rocket, title: "Continuous Growth", desc: "Keep building skills across emerging technologies and career domains." },
];

export default function WhyLearnDepth() {
  const [hoveredId, setHoveredId] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger entrance animation on mount (or use IntersectionObserver for better scroll trigger)
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.backgroundDetails}>
        <div className={styles.gridPattern}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>WHY LEARNDEPTH?</span>
          <h2 className={styles.heading}>
            More Than Learning.<br />
            <span className={styles.highlight}>A Complete Career Journey.</span>
          </h2>
          <p className={styles.description}>
            LearnDepth combines practical learning, real-world projects, mentorship, internships and career-focused experiences to help you move from learning skills to applying them with confidence.
          </p>
        </div>

        {/* Desktop Circular Ecosystem */}
        <div className={`${styles.ecosystem} ${isAnimated ? styles.animateIn : ''}`}>
          <div className={styles.circlePath}>
            {/* Pulsing/glowing SVG circle could go here, or CSS borders */}
            <div className={styles.circleInner}></div>
          </div>
          
          <div className={styles.centerIdentity}>
            <div className={styles.centerGlow}></div>
            <div className={styles.centerContent}>
              <div className={styles.logoMark}>
                <span className={styles.logoL}>L</span>
                <span className={styles.logoD}>D</span>
              </div>
              <h3 className={styles.centerTitle}>LearnDepth</h3>
              <p className={styles.centerSubtitle}>Learn. Build. Experience. Grow.</p>
            </div>
          </div>

          <div className={styles.nodesWrapper}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isHovered = hoveredId === feature.id;
              
              return (
                <div 
                  key={feature.id}
                  className={`${styles.nodeContainer} ${styles[`node${feature.angle}`]} ${isHovered ? styles.nodeHovered : ''}`}
                  onMouseEnter={() => setHoveredId(feature.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className={styles.iconWrapper}>
                    <Icon size={24} className={styles.icon} />
                  </div>
                  <div className={styles.nodeText}>
                    <h4 className={styles.nodeTitle}>{feature.title}</h4>
                    <p className={styles.nodeDesc}>{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Journey */}
        <div className={styles.mobileJourney}>
          <div className={styles.mobileCenterIdentity}>
            <div className={styles.logoMark}>
              <span className={styles.logoL}>L</span>
              <span className={styles.logoD}>D</span>
            </div>
            <h3 className={styles.centerTitle}>LearnDepth</h3>
          </div>
          
          <div className={styles.verticalPath}>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.id} className={styles.mobileNode}>
                  <div className={styles.mobileIconWrapper}>
                    <Icon size={20} className={styles.mobileIcon} />
                  </div>
                  <div className={styles.mobileNodeText}>
                    <h4 className={styles.mobileNodeTitle}>{feature.title}</h4>
                    <p className={styles.mobileNodeDesc}>{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.ctaArea}>
          <h3 className={styles.ctaHeading}>Ready to Build Skills That Matter?</h3>
          <p className={styles.ctaDesc}>
            Explore LearnDepth programs designed around practical skills, real-world experience and career growth.
          </p>
          <div className={styles.buttonGroup}>
            <a href="/programs" className={styles.primaryBtn}>
              Explore Programs <ArrowRight size={18} />
            </a>
            <a href="tel:+919980855683" className={styles.secondaryBtn}>
              <Phone size={18} /> Talk to an Advisor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
