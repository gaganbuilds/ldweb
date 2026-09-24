import styles from './Hero.module.css';
import { ArrowUpRight, Phone } from 'lucide-react';

export default function HeroActions() {
  return (
    <div className={styles.actionsContainer}>
      <a href="/programs" className={styles.actionCard}>
        <div className={styles.actionContent}>
          <span className={styles.actionTitle}>Explore Programs</span>
          <div className={styles.actionIconWrapper}>
            <ArrowUpRight size={18} className={styles.actionIcon} />
          </div>
        </div>
      </a>
      
      <a href="tel:+919980855683" className={styles.actionCard}>
        <div className={styles.actionContent}>
          <span className={styles.actionTitle}>Talk to an Advisor</span>
          <div className={`${styles.actionIconWrapper} ${styles.actionIconAlt}`}>
            <Phone size={18} className={styles.actionIcon} />
          </div>
        </div>
      </a>
    </div>
  );
}
