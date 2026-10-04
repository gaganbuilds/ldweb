import { CheckCircle2 } from 'lucide-react';
import styles from './DataScienceAbout.module.css';
import aboutImage from '../assets/abt-ds.png';

export default function DataScienceAbout() {
  const features = [
    {
      title: "Industry Expert Mentorship",
      description: "Learn from experienced mentors and gain practical guidance across Data Science, Machine Learning, AI, and Generative AI."
    },
    {
      title: "Real-World Project Portfolio",
      description: "Build practical projects using real datasets and modern AI tools to create a portfolio that demonstrates your skills."
    },
    {
      title: "Internship Experience",
      description: "Apply your learning through hands-on internship experience and work on projects designed around real-world industry scenarios."
    },
    {
      title: "Career & Placement Assistance",
      description: "Get career guidance, resume support, interview preparation, and access to relevant hiring opportunities through LearnDepth."
    },
    {
      title: "Generative AI Skills",
      description: "Learn how modern Generative AI tools and techniques can be applied to data analysis, automation, applications, and real-world business problems."
    }
  ];

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        
        {/* Left Column */}
        <div className={styles.contentColumn}>
          <div className={styles.headingWrapper}>
            <div className={styles.accentLine}></div>
            <h2 className={styles.heading}>
              About Our Data Science &<br className={styles.breakDesktop} /> Generative AI Program
            </h2>
          </div>
          
          <p className={styles.description}>
            Build practical skills in Data Science, Machine Learning, and Generative AI through hands-on learning, real-world projects, expert mentorship, and career-focused experience designed to help you become industry-ready.
          </p>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                <div className={styles.featureIconWrapper}>
                  <CheckCircle2 className={styles.checkIcon} size={24} weight="fill" />
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDesc}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.imageColumn}>
          <img 
            src={aboutImage}
            alt="Person working on a laptop, coding and analyzing data" 
            className={styles.aboutImage}
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
}
