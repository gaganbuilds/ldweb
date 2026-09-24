import { Globe, Award, GraduationCap } from 'lucide-react';
import styles from './AccreditationCard.module.css';
import msmeLogo from '../assets/msme.png';
import isoLogo from '../assets/iso.png';

export default function AccreditationCard() {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.ribbon}>
          <Globe className={styles.ribbonIcon} size={16} strokeWidth={2.5} />
          <span className={styles.ribbonText}>Recognized & Certified</span>
        </div>

        <div className={styles.logosArea}>
          <div className={styles.logoContainer}>
            <img src={msmeLogo} alt="MSME Logo" className={styles.logoImage} />
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.logoContainer}>
            <img src={isoLogo} alt="ISO 9001:2015 Logo" className={styles.logoImage} />
          </div>
        </div>

        <div className={styles.infoPoints}>
          <div className={styles.infoPoint}>
            <div className={styles.iconWrapper}>
              <Award size={20} strokeWidth={2} />
            </div>
            <p className={styles.infoText}>
              Registered under MSME<br/>
              - Government of India
            </p>
          </div>
          
          <div className={styles.infoPoint}>
            <div className={styles.iconWrapper}>
              <Award size={20} strokeWidth={2} />
            </div>
            <p className={styles.infoText}>
              ISO 9001:2015 Certified<br/>
              - Assuring Quality Standards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
