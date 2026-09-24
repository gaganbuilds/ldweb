import styles from './Hero.module.css';
import { Sparkles } from 'lucide-react';

export default function HeroAnnouncement() {
  return (
    <div className={styles.announcement}>
      <span className={styles.announcementIcon}><Sparkles size={14} /></span>
      Industry-Ready Learning. Built for Real Outcomes
    </div>
  );
}
