import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './AmbassadorBenefits.module.css';

// Importing existing placeholder assets to represent distinct Indian student/campus scenes
import img1 from '../assets/student.png';
import img2 from '../assets/about_impact_bg.jpg';
import img3 from '../assets/career_guidance_hero.jpg';
import img4 from '../assets/about_hero.jpg';
import img5 from '../assets/faq_illustration.jpg';
import img6 from '../assets/hero.png';
// Reusing one asset for the 7th card as we only have 6 distinct suitable assets locally
import img7 from '../assets/student.png'; 

const BENEFITS = [
  {
    id: 1,
    title: "Earn Up to ₹15K",
    description: "Get performance-based incentives of up to ₹15,000 per month by actively contributing to LearnDepth's campus initiatives.",
    clarification: "Performance Based",
    image: img1,
    alt: "Indian college student working on a laptop, achieving performance goals"
  },
  {
    id: 2,
    title: "Free Learning & Training",
    description: "Get access to selected LearnDepth training programs and courses to strengthen your technical and career-ready skills.",
    image: img2,
    alt: "Indian college students learning together with modern technology"
  },
  {
    id: 3,
    title: "100% Placement Assistance",
    description: "Get access to career guidance, placement-focused support, resume guidance, interview preparation, and relevant hiring opportunities.",
    image: img3,
    alt: "Student preparing for an interview with a career advisor"
  },
  {
    id: 4,
    title: "Hiring Drive Opportunities",
    description: "Get opportunities to participate in selected hiring drives, recruitment activities, and career-focused events shared through the LearnDepth network.",
    image: img4,
    alt: "Campus hiring event with students interacting with recruiters"
  },
  {
    id: 5,
    title: "Build Your Network",
    description: "Connect with students, mentors, ambassadors, industry professionals, and the wider LearnDepth community.",
    image: img5,
    alt: "Diverse Indian college students networking and collaborating"
  },
  {
    id: 6,
    title: "Lead a Club on Campus",
    description: "Take initiative on your campus by building and leading a LearnDepth student community, organizing activities, and encouraging peer learning.",
    image: img6,
    alt: "Student leader speaking and leading a campus community"
  },
  {
    id: 7,
    title: "Scholarship Opportunities",
    description: "Access selected scholarship and learning-support opportunities based on program eligibility, performance, and availability.",
    image: img7,
    alt: "Indian student receiving recognition and scholarship opportunity"
  }
];

export default function AmbassadorBenefits() {
  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      if (trackRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        // If reached the end, scroll back to start, else scroll right
        if (scrollLeft >= maxScroll - 10) {
          trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by roughly one card width (card width is determined by CSS, but roughly clientWidth / visible_cards)
          // We can just query the first card's width
          const cardWidth = trackRef.current.children[0].offsetWidth + 24; // 24 is gap
          trackRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Update active index based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (trackRef.current) {
        const { scrollLeft } = trackRef.current;
        const cardWidth = trackRef.current.children[0].offsetWidth + 24;
        const newIndex = Math.round(scrollLeft / cardWidth);
        setActiveIndex(Math.min(newIndex, BENEFITS.length - 1));
      }
    };

    const track = trackRef.current;
    if (track) {
      track.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (track) track.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollPrev = () => {
    if (trackRef.current) {
      const cardWidth = trackRef.current.children[0].offsetWidth + 24;
      trackRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (trackRef.current) {
      const cardWidth = trackRef.current.children[0].offsetWidth + 24;
      trackRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section} aria-labelledby="benefits-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="benefits-heading" className={styles.title}>
            More Than an Ambassador Program
          </h2>
          <p className={styles.subtitle}>
            Turn your campus involvement into real skills, opportunities, connections, and career growth.
          </p>
        </div>

        <div 
          className={styles.carouselWrapper}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div className={styles.carouselTrack} ref={trackRef}>
            {BENEFITS.map((benefit) => (
              <div key={benefit.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{benefit.title}</h3>
                  <p className={styles.cardDescription}>{benefit.description}</p>
                  {benefit.clarification && (
                    <span className={styles.cardClarification}>
                      {benefit.clarification}
                    </span>
                  )}
                </div>
                <div className={styles.cardImageWrapper}>
                  <img 
                    src={benefit.image} 
                    alt={benefit.alt} 
                    className={styles.cardImage}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className={styles.controls}>
            <button 
              className={styles.controlButton} 
              onClick={scrollPrev}
              aria-label="Previous benefits"
              disabled={activeIndex === 0}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className={styles.indicators}>
              {BENEFITS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.indicator} ${idx === activeIndex ? styles.indicatorActive : ''}`}
                />
              ))}
            </div>

            <button 
              className={styles.controlButton} 
              onClick={scrollNext}
              aria-label="Next benefits"
              // Disable logic rough estimation (depends on visible cards, but simple disable at last card is okay)
              disabled={activeIndex >= BENEFITS.length - 1}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
