import { CheckCircle } from 'lucide-react';
import styles from './InternshipLeadSection.module.css';

export default function LeadSuccessState({ onReset }) {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successIcon}>
        <CheckCircle size={32} />
      </div>
      <h3 className={styles.successHeading}>Thank you! Your internship enquiry has been received.</h3>
      <p className={styles.successText}>Our team will get in touch with you shortly.</p>
      <button className={styles.closeButton} onClick={onReset}>
        Submit another response
      </button>
    </div>
  );
}
