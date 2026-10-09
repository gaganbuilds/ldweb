import { 
  Briefcase, 
  Camera, 
  Video, 
  Users, 
  MessageCircle, // Using MessageCircle for WhatsApp if icon not present, or standard
  ArrowRight
} from 'lucide-react';
import styles from './Footer.module.css';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Partner With Us', href: '/hire-from-us' },
  { label: 'Verify Certificate', href: '/verify-certificate' },
  { label: 'CodeDepth', href: 'https://codedepth.site', external: true }
];

const programs = [
  { label: "Machine Learning", href: "/?program=machine-learning#internship-form" },
  { label: "Data Science", href: "/?program=data-science#internship-form" },
  { label: "Python", href: "/?program=python#internship-form" },
  { label: "Web Development", href: "/?program=web-development#internship-form" },
  { label: "App Development", href: "/?program=app-development#internship-form" },
  { label: "AI / Generative AI", href: "/?program=ai#internship-form" },
  { label: "Java", href: "/?program=java#internship-form" },
  { label: "Sales & Marketing", href: "/?program=sales-marketing#internship-form" }
];

// Removed placeholder socialLinks to comply with "No # links" rule

export default function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        {/* Column 1: Company Info */}
        <div className={styles.footerColumn}>
          <div className={styles.logo}>
            <a href="/">
              <span className={styles.logoText}>Learn Depth<span className={styles.tm}>™</span></span>
            </a>
          </div>
          
          <div className={styles.companyInfo}>
            <div className={styles.infoBlock}>
              <h4 className={styles.infoTitle}>ADDRESS</h4>
              <p className={styles.infoText}>
                <strong>LearnDepth Academy LLP</strong><br />
                #527, 8th Main Road,<br />
                Mahadeshwara Badavane Layout,<br />
                Metagalli, Mysuru - 570016,<br />
                Karnataka, India
              </p>
            </div>
            
            <div className={styles.infoBlock}>
              <h4 className={styles.infoTitle}>EMAIL</h4>
              <a href="mailto:learndepthacademy@gmail.com" className={styles.infoTextLink}>
                learndepthacademy@gmail.com
              </a>
            </div>
            
            <div className={styles.infoBlock}>
              <h4 className={styles.infoTitle}>PHONE</h4>
              <a href="tel:+919980855683" className={styles.infoTextLink}>
                +91 9980855683
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Menu */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnHeading}>Menu</h3>
          <span className={styles.columnSubHeading}>QUICK LINKS</span>
          <ul className={styles.linkList}>
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className={styles.footerLink}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Our Programs */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnHeading}>Our Programs</h3>
          <span className={styles.columnSubHeading}>EXPLORE LEARNDEPTH</span>
          <ul className={styles.linkList}>
            {programs.map((link, index) => (
              <li key={index}>
                <a href={link.href} className={styles.footerLink}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: CTA Panel */}
        <div className={styles.ctaColumn}>
          <div className={styles.ctaPanel}>
            <h3 className={styles.ctaHeading}>
              Build Skills. Gain Experience. Get Career Ready.
            </h3>
            <p className={styles.ctaText}>
              Learn industry-relevant skills through practical programs, internships, workshops and career-focused learning experiences.
            </p>
            <a href="/programs" className={styles.ctaButton}>
              Explore Programs
              <ArrowRight size={18} className={styles.ctaButtonIcon} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className={styles.footerBottomBar}>
        <div className={styles.bottomContent}>
          <p className={styles.copyright}>
            © 2026 LearnDepth Academy LLP. All Rights Reserved.
          </p>
          <div className={styles.policyLinks}>
            <a href="/terms" className={styles.policyLink}>Terms & Conditions</a>
            <span className={styles.policyDivider}>|</span>
            <a href="/privacy" className={styles.policyLink}>Privacy Policy</a>
            <span className={styles.policyDivider}>|</span>
            <a href="/refund" className={styles.policyLink}>Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
