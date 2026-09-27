import styles from './InternshipLeadSection.module.css';
import TrustIndicator from './TrustIndicator';
import InternshipLeadForm from './InternshipLeadForm';
import { FileText } from 'lucide-react';

export default function InternshipLeadSection() {
  return (
    <section className={styles.leadSection} id="internship-form">
      <div className={styles.container}>
        
        {/* LEFT COLUMN */}
        <div className={styles.leftContent}>
          <h2 className={styles.headline}>
            <span>India's Most Trusted and Leading</span>
            <span className={styles.highlight}>IT Training & Learning-Based Internship Provider</span>
            <span>Built for Real-World Opportunities</span>
          </h2>
          
          <TrustIndicator />
          
          <div className={styles.ctaWrapper}>
            <button 
              className={styles.ctaButton}
              onClick={(e) => {
                e.preventDefault();
                const form = document.querySelector('#internship-form form input');
                if (form) form.focus();
              }}
            >
              Explore Internship Programs
              <FileText size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightContent}>
          {/* Decorative graphic behind the form */}
          <svg className={styles.decorativeGraphic} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50 L350 150 L250 350 L50 200 Z" stroke="#B7DC00" strokeWidth="2" />
            <path d="M150 20 L380 100 L300 380 L20 250 Z" stroke="#B7DC00" strokeWidth="1" opacity="0.5" />
          </svg>
          
          <div className={styles.formCard}>
            <h3 className={styles.formHeading}>Start Your Internship Journey With LearnDepth</h3>
            <p className={styles.formSubheading}>Build real-world skills, work on practical projects, learn from mentors, and gain industry-focused experience through LearnDepth internship programs.</p>
            <p className={styles.formContextText}>Interested in gaining real-world industry experience? Apply for a LearnDepth internship and take the next step toward becoming career-ready.</p>
            <InternshipLeadForm />
          </div>
        </div>

      </div>
    </section>
  );
}
