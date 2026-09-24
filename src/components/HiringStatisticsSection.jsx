import styles from './HiringStatisticsSection.module.css';

export default function HiringStatisticsSection() {
  const statistics = [
    {
      value: "45+",
      label: "Hiring Companies"
    },
    {
      value: "2.5 – 4.5 LPA",
      label: "Average Fresher Salary"
    },
    {
      value: "3000+",
      label: "Alumni Network"
    },
    {
      value: "Weekly",
      label: "Hiring Calls"
    }
  ];

  return (
    <div className={styles.sectionWrapper}>
      <section className={styles.sectionContainer}>
        <h2 className={styles.heading}>
          A <span className={styles.accentGreen}>Hiring Call</span> Every Week. Your Turn Next.
        </h2>
        
        <div className={styles.cardsGrid}>
          {statistics.map((stat, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
