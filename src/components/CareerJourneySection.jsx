import styles from './CareerJourneySection.module.css';
import studentImg from '../assets/student.png';
import ldhireImg from '../assets/ldhire.png';
import codedepthImg from '../assets/codedepth.png';
import { Briefcase, Code2, GraduationCap, LineChart } from 'lucide-react';

export default function CareerJourneySection() {
  return (
    <div className={styles.sectionWrapper}>
      {/* Decorative red gradients in the background */}
      <div className={`${styles.bgGradient} ${styles.bgGradientLeft}`}></div>
      <div className={`${styles.bgGradient} ${styles.bgGradientRight}`}></div>
      
      <section className={styles.sectionContainer}>
        <div className={styles.cardsGrid}>
        
        {/* Card 1: Interview Readiness */}
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.badge}>Interview Readiness</div>
            <h3 className={styles.heading}>
              Prepare Before You Interview.<br/>
              <span className={styles.accentText}>Perform With Confidence.</span>
            </h3>
            
            <div className={styles.statsContainer}>
              <div className={styles.statBox}>
                <div className={styles.statValue}>2-Stage</div>
                <div className={styles.statLabel}>HR Mock Interviews</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statValue}>1:1</div>
                <div className={styles.statLabel}>HR Mentorship</div>
              </div>
            </div>
          </div>
          
          <div className={styles.imageArea}>
            <div className={styles.pinkGlow}></div>
            {/* Recreating the large tilted visual block from the reference */}
            <div className={styles.card1Composition}>
              <div className={styles.card1ImageWrapper}>
                 <img src={ldhireImg} alt="LearnDepth Hire Platform" className={styles.card1ImageMain} />
              </div>
              <div className={styles.card1ImageWrapperSecondary}>
                 <img src={ldhireImg} alt="" className={styles.card1ImageSecondary} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Job-Ready Programs */}
        <div className={styles.card}>
          <div className={styles.decorativeArcs}></div>
          <div className={styles.floatingIcons}>
            <div className={`${styles.iconCircle} ${styles.iconTopLeft}`}><GraduationCap size={20} /></div>
            <div className={`${styles.iconCircle} ${styles.iconTopRight}`}><Code2 size={20} /></div>
            <div className={`${styles.iconCircle} ${styles.iconBottomLeft}`}><Briefcase size={20} /></div>
            <div className={`${styles.iconCircle} ${styles.iconBottomRight}`}><LineChart size={20} /></div>
          </div>
          
          <div className={styles.cardContentCenter}>
            <h3 className={styles.headingCenter}>
              From Learning to <span className={styles.accentText}>Job-Ready</span>
            </h3>
            <div className={styles.centralMetric}>
              <div className={styles.metricText}>
                Learn <span className={styles.arrow}>→</span> Practice <span className={styles.arrow}>→</span> Prepare
              </div>
              <div className={styles.metricLabel}>Career Readiness Journey</div>
            </div>
          </div>
          
          <div className={styles.imageAreaCenter}>
            <img src={studentImg} alt="LearnDepth students preparing for careers" className={styles.heroImageCentered} />
          </div>
        </div>

        {/* Card 3: Coding Practice */}
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.badge}>Coding Practice</div>
            <h3 className={styles.heading}>
              Practice Your Skills.<br/>
              <span className={styles.accentText}>Build With Confidence.</span>
            </h3>
            
            <div className={styles.statsContainer}>
              <div className={styles.statBox}>
                <div className={styles.statValue}>DSA</div>
                <div className={styles.statLabel}>Structured Roadmaps</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statValue}>Core CS</div>
                <div className={styles.statLabel}>System Design</div>
              </div>
            </div>
          </div>
          
          <div className={styles.imageArea}>
            <div className={styles.pinkGlow}></div>
            {/* Recreating the scattered, overlapping multi-card layout from the reference */}
            <div className={styles.card3Composition}>
              <div className={`${styles.card3Item} ${styles.card3Item1}`}>
                <img src={codedepthImg} alt="CodeDepth Platform" className={styles.card3Image} />
              </div>
              <div className={`${styles.card3Item} ${styles.card3Item2}`}>
                <img src={codedepthImg} alt="" className={styles.card3Image} />
              </div>
              <div className={`${styles.card3Item} ${styles.card3Item3}`}>
                <img src={codedepthImg} alt="" className={styles.card3Image} />
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
    </div>
  );
}
