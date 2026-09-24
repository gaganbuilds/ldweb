import styles from './Hero.module.css';

const metrics = [
  { value: '7000+', label: 'Students Trained', icon: '👨‍🎓' },
  { value: '500+', label: 'Projects Completed', icon: '🚀' },
  { value: '20+', label: 'Industry Mentors', icon: '💼' }
];

export default function HeroMetricCards() {
  return (
    <div className={styles.metricsContainer}>
      {metrics.map((metric, index) => (
        <div key={index} className={styles.metricCard}>
          <div className={styles.metricIcon}>{metric.icon}</div>
          <div className={styles.metricInfo}>
            <div className={styles.metricValue}>{metric.value}</div>
            <div className={styles.metricLabel}>{metric.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
