import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { GraduationCap, ArrowRight, Download, IndianRupee, Briefcase, Award, BookOpen, TrendingUp } from 'lucide-react';
import AmbassadorBenefits from '../components/AmbassadorBenefits';
import styles from './CampusAmbassador.module.css';
import studentImg from '../assets/student.png';

export default function CampusAmbassador() {
  const handleApply = () => {
    // This will open the application form
    // TODO: Connect to actual application form modal or route
    console.log("Open application form");
    alert("Application form will open here.");
  };

  return (
    <>
      <SEOHead 
        title="Campus Ambassador Program | LearnDepth Academy"
        description="Join the LearnDepth Campus Ambassador Program to build leadership skills, access free courses, earn performance-based rewards and gain valuable career experience."
        canonicalUrl="https://www.learndepthacademy.com/campus-ambassador"
      />
      <Navbar />
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.heroContainer}>
            {/* Left Content */}
            <div className={styles.heroContent}>
              <div className={styles.programLabel}>
                <GraduationCap className={styles.labelIcon} size={18} />
                <span>Campus Ambassador Program</span>
              </div>
              
              <h1 className={styles.heroTitle}>
                Learn. Lead.<br />
                <span className={styles.highlight}>Make an Impact.</span>
              </h1>
              
              <p className={styles.heroDescription}>
                Represent LearnDepth on your campus. Build leadership skills, grow your network, earn performance-based rewards, and be part of our mission to help students gain industry-oriented learning and internship opportunities.
              </p>
              
              <div className={styles.ctaGroup}>
                <button onClick={handleApply} className={styles.primaryCta}>
                  Apply Now <ArrowRight size={18} />
                </button>
                <a href="#brochure" className={styles.secondaryCta}>
                  Download Brochure <Download size={18} />
                </a>
              </div>
              
              <div className={styles.benefitsRow}>
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIconWrapper}>
                    <IndianRupee className={styles.benefitIcon} size={20} />
                  </div>
                  <div className={styles.benefitText}>
                    <strong>Up to ₹15K</strong>
                    <span>Stipend per Month</span>
                    <span className={styles.subText}>(Performance Based)</span>
                  </div>
                </div>
                
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIconWrapper}>
                    <Briefcase className={styles.benefitIcon} size={20} />
                  </div>
                  <div className={styles.benefitText}>
                    <strong>100%</strong>
                    <span>Placement</span>
                    <span>Assistance</span>
                  </div>
                </div>
                
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIconWrapper}>
                    <Award className={styles.benefitIcon} size={20} />
                  </div>
                  <div className={styles.benefitText}>
                    <strong>Internship</strong>
                    <span>Certificate</span>
                    <span>from LearnDepth</span>
                  </div>
                </div>
                
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIconWrapper}>
                    <BookOpen className={styles.benefitIcon} size={20} />
                  </div>
                  <div className={styles.benefitText}>
                    <strong>Free Courses</strong>
                    <span>Access to premium</span>
                    <span>learning resources</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Visual */}
            <div className={styles.heroVisual}>
              <div className={styles.imageWrapper}>
                <img src={studentImg} alt="LearnDepth Campus Ambassador" className={styles.studentImage} />
                <div className={styles.floatingBadge}>
                  <div className={styles.badgeIconWrapper}>
                    <TrendingUp className={styles.badgeIcon} size={24} />
                  </div>
                  <div className={styles.badgeText}>
                    <strong>Be a leader</strong>
                    <span>on your campus</span>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className={styles.decoration1}></div>
                <div className={styles.decoration2}></div>
              </div>
            </div>
          </div>
        </section>
        
        <AmbassadorBenefits />
      </main>
      <Footer />
    </>
  );
}
