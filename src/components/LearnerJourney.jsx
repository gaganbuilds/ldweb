import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Code, Briefcase, FileText, MessageSquare, Award } from 'lucide-react';
import styles from './LearnerJourney.module.css';

const learnerJourney = [
  { 
    id: 1, number: '01', 
    title: "Learn the Foundations", 
    description: "Build strong fundamentals through structured learning in programming, AI, data and modern technology domains, with concepts explained in a practical and student-friendly way.", 
    icon: <BookOpen strokeWidth={1.5} size={28} /> 
  },
  { 
    id: 2, number: '02', 
    title: "Build Real Projects", 
    description: "Turn concepts into practical experience through hands-on projects, problem-solving tasks and technology-focused work that helps learners build meaningful skills.", 
    icon: <Code strokeWidth={1.5} size={28} /> 
  },
  { 
    id: 3, number: '03', 
    title: "Develop Industry Skills", 
    description: "Learn the tools, technologies and workflows used in real-world roles across software development, data, AI, cloud and other high-demand technology domains.", 
    icon: <Briefcase strokeWidth={1.5} size={28} /> 
  },
  { 
    id: 4, number: '04', 
    title: "Build Your Career Profile", 
    description: "Strengthen your resume, portfolio and professional presence with projects, certifications and career-focused guidance that helps you present your skills with confidence.", 
    icon: <FileText strokeWidth={1.5} size={28} /> 
  },
  { 
    id: 5, number: '05', 
    title: "Prepare for Opportunities", 
    description: "Practice interviews, technical concepts and career conversations so you can approach internships, placements and industry opportunities with greater confidence.", 
    icon: <MessageSquare strokeWidth={1.5} size={28} /> 
  },
  { 
    id: 6, number: '06', 
    title: "Learn. Intern. Grow.", 
    description: "Apply your learning through internship and industry exposure opportunities, gaining practical experience while building the confidence to take your next career step.", 
    icon: <Award strokeWidth={1.5} size={28} /> 
  },
];

export default function LearnerJourney() {
  const originalLength = learnerJourney.length; // 6
  const [currentIndex, setCurrentIndex] = useState(originalLength);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const autoPlayRef = useRef(null);
  const touchStartX = useRef(0);

  // Duplicate 3 times for a seamless infinite loop track
  const extendedJourney = [...learnerJourney, ...learnerJourney, ...learnerJourney];
  
  // Card step size (280px width + 30px margin) MUST match CSS mathematically to keep the curve aligned
  const stepSizePx = 310;

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  }, []);

  // Handle infinite loop wrapping invisibly
  const handleTransitionEnd = () => {
    if (currentIndex >= originalLength * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - originalLength);
    } else if (currentIndex < originalLength) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + originalLength);
    }
  };

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(nextSlide, 4000);
  }, [nextSlide]);

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, currentIndex]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    stopAutoPlay();
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoPlay();
  };

  return (
    <section className={styles.sectionWrapper} aria-label="Learner Journey">
      <div className={styles.container}>
        
        <div className={styles.leftColumn}>
          <h2 className={styles.heading}>
            Why Learners<br />Choose Learn Depth
          </h2>
          
          <div className={styles.navButtons}>
            <button 
              className={styles.navButton} 
              onClick={prevSlide} 
              aria-label="Previous step"
              onMouseEnter={stopAutoPlay}
              onMouseLeave={startAutoPlay}
            >
              <ArrowLeft size={24} />
            </button>
            <button 
              className={styles.navButton} 
              onClick={nextSlide} 
              aria-label="Next step"
              onMouseEnter={stopAutoPlay}
              onMouseLeave={startAutoPlay}
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>

        <div 
          className={styles.rightColumn}
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
        >
          <div className={styles.carouselViewport}>
            <div 
              className={styles.carouselTrack}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(-${currentIndex * stepSizePx}px)`,
                transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
              }}
            >
              {extendedJourney.map((card, idx) => (
                <div key={`${card.id}-${idx}`} className={styles.cardSlide}>
                  <div className={styles.card}>
                    <div className={styles.cardNumber}>{card.number}</div>
                    
                    <div className={styles.iconCircle}>
                      {card.icon}
                    </div>
                    
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardDescription}>{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
