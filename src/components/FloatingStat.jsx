import styles from './Hero.module.css';
import { TrendingUp } from 'lucide-react';

export default function FloatingStat() {
  return (
    <div className={styles.floatingStat}>
      <div className={styles.floatingStatIcon}>
        <TrendingUp size={32} color="#ffffff" strokeWidth={2.5} />
      </div>
      <div className={styles.floatingStatValue}>10x</div>
      <div className={styles.floatingStatLabel}>More Practical Learning</div>
    </div>
  );
}
