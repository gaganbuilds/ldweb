import React from 'react';
import { Users, UserCheck, Briefcase, Award } from 'lucide-react';
import styles from './DataScienceStats.module.css';

export default function DataScienceStats() {
  const stats = [
    { icon: <Users size={20} />, value: "3K+", label: "Data Science Learners" },
    { icon: <UserCheck size={20} />, value: "10+", label: "Expert Mentors" },
    { icon: <Briefcase size={20} />, value: "Real-World", label: "Projects" },
    { icon: <Award size={20} />, value: "100%", label: "Placement Assistance" },
  ];

  return (
    <div className={styles.statsContainer}>
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
          {index < stats.length - 1 && <div className={styles.divider}></div>}
        </React.Fragment>
      ))}
    </div>
  );
}
