import styles from './Hero.module.css';
import FloatingStat from './FloatingStat';
// Using a placeholder image path. We will replace this with a generated asset or high quality stock.
import studentImage from '../assets/student.png'; 

export default function HeroVisual() {
  return (
    <div className={styles.visualContainer}>
      {/* Decorative dot pattern */}
      <div className={styles.dotPattern}></div>
      
      <FloatingStat />
      
      <div className={styles.imageWrapper}>
        <img 
          src={studentImage} 
          alt="LearnDepth Student" 
          className={styles.studentImage}
          fetchpriority="high"
        />
      </div>
    </div>
  );
}
