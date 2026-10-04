import styles from './FourWaysToPartner.module.css';
import { ArrowRight } from 'lucide-react';

export default function FourWaysToPartner() {
  const scrollToForm = () => {
    const formSection = document.getElementById('hire-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ways = [
    {
      id: 1,
      title: 'Hire Job-Ready Talent',
      description: 'Access trained and industry-ready talent from LearnDepth across Data Science, AI, Full Stack Development, Python, Java, Web Development and other in-demand technology domains.',
      numberColor: '#10b981', // bright green
      titleColor: '#10b981',
    },
    {
      id: 2,
      title: 'Co-Create Industry Programs',
      description: 'Partner with LearnDepth to co-create practical courses, workshops, bootcamps and learning programs designed around real industry skills and emerging technologies.',
      numberColor: '#a7f3d0', // light green
      titleColor: '#a7f3d0',
    },
    {
      id: 3,
      title: 'College Collaborations',
      description: 'Collaborate with LearnDepth to bring industry-oriented workshops, internships, skill programs, hiring opportunities and technology initiatives to your college community.',
      numberColor: '#14b8a6', // teal/green
      titleColor: '#14b8a6',
    },
    {
      id: 4,
      title: 'Corporate Collaborations',
      description: 'Work with LearnDepth on employee upskilling, technical workshops, AI and technology programs, talent initiatives and customized learning solutions for your organization.',
      numberColor: '#5eead4', // soft blue-green
      titleColor: '#5eead4',
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          <span className={styles.accent}>Four Ways</span> to Partner with LearnDepth
        </h2>

        <div className={styles.grid}>
          {ways.map((way) => (
            <div key={way.id} className={styles.card}>
              <div 
                className={styles.numberCircle}
                style={{ backgroundColor: way.numberColor }}
              >
                {way.id}
              </div>
              <h3 
                className={styles.cardTitle}
                style={{ color: way.titleColor }}
              >
                {way.title}
              </h3>
              <p className={styles.cardDescription}>
                {way.description}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.ctaWrapper}>
          <button onClick={scrollToForm} className={styles.ctaButton}>
            Let's Connect <ArrowRight size={18} className={styles.arrow} />
          </button>
        </div>
      </div>
    </section>
  );
}
