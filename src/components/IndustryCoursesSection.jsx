import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Calendar, ArrowLeft, ArrowRight, FileText, ArrowRightCircle } from 'lucide-react';
import styles from './IndustryCoursesSection.module.css';
import ProgramEnquiryModal from './ProgramEnquiryModal';
import {
  PythonIcon, PowerBIIcon, TableauIcon, NumPyIcon, PandasIcon,
  TensorFlowIcon, PyTorchIcon, ScikitLearnIcon, JupyterIcon,
  OpenAIIcon, LangChainIcon, HuggingFaceIcon, PineconeIcon, DockerIcon,
  DataScienceIllustration, MLIllustration, GenAIIllustration
} from './CourseIcons';

const coursesData = [
  {
    id: "data-science",
    title: "Data Science Diploma",
    seats: 6,
    description: "Master data analysis, visualization and real-world problem solving with industry tools.",
    duration: "6 Months Online Training",
    batch: "Weekday and Weekend Batches",
    batchStartDate: new Date(Date.now() + 1000 * 60 * 60 * 48), // 48 hours from now
    brochureUrl: "#",
    route: "/courses/data-science-diploma",
    illustration: <DataScienceIllustration />,
    badges: ["UNLIMITED INTERVIEWS", "INTEGRATED INTERNSHIP"],
    technologies: [
      { name: "Python", icon: <PythonIcon /> },
      { name: "Power BI", icon: <PowerBIIcon /> },
      { name: "Tableau", icon: <TableauIcon /> },
      { name: "NumPy", icon: <NumPyIcon /> },
      { name: "Pandas", icon: <PandasIcon /> }
    ]
  },
  {
    id: "machine-learning",
    title: "Machine Learning Diploma",
    seats: 8,
    description: "Build and deploy machine learning models with hands-on projects and real-world datasets.",
    duration: "6 Months Online Training",
    batch: "Weekday and Weekend Batches",
    batchStartDate: new Date(Date.now() + 1000 * 60 * 60 * 120),
    brochureUrl: "#",
    route: "/courses/machine-learning-diploma",
    illustration: <MLIllustration />,
    badges: ["LIVE PROJECTS", "INTEGRATED INTERNSHIP"],
    technologies: [
      { name: "Python", icon: <PythonIcon /> },
      { name: "TensorFlow", icon: <TensorFlowIcon /> },
      { name: "PyTorch", icon: <PyTorchIcon /> },
      { name: "scikit-learn", icon: <ScikitLearnIcon /> },
      { name: "Jupyter", icon: <JupyterIcon /> }
    ]
  },
  {
    id: "generative-ai",
    title: "Diploma in Generative AI",
    seats: 5,
    description: "Learn to build real-world GenAI applications using LLMs, LangChain and modern AI tools.",
    duration: "6 Months Online Training",
    batch: "Weekday and Weekend Batches",
    batchStartDate: new Date(Date.now() + 1000 * 60 * 60 * 72),
    brochureUrl: "#",
    route: "/courses/generative-ai",
    illustration: <GenAIIllustration />,
    badges: ["INDUSTRY VETTED CURRICULUM", "INTEGRATED INTERNSHIP"],
    technologies: [
      { name: "OpenAI", icon: <OpenAIIcon /> },
      { name: "LangChain", icon: <LangChainIcon /> },
      { name: "Hugging Face", icon: <HuggingFaceIcon /> },
      { name: "Pinecone", icon: <PineconeIcon /> },
      { name: "Docker", icon: <DockerIcon /> }
    ]
  }
];

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={styles.countdownTime}>
      {timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}
    </div>
  );
};

export default function IndustryCoursesSection() {
  const [currentIndex, setCurrentIndex] = useState(coursesData.length);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef(0);
  const autoPlayRef = useRef(null);
  
  // Duplicate array 3 times for infinite loop effect
  const extendedCourses = [...coursesData, ...coursesData, ...coursesData, ...coursesData];

  const updateCardsPerView = () => {
    if (window.innerWidth < 768) setCardsPerView(1);
    else if (window.innerWidth < 1200) setCardsPerView(2);
    else setCardsPerView(3);
  };

  useEffect(() => {
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  }, []);

  // Handle infinite loop reset after transition ends
  const handleTransitionEnd = () => {
    const originalLength = coursesData.length;
    // If we've scrolled into the third duplicated set
    if (currentIndex >= originalLength * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - originalLength);
    } 
    // If we've scrolled back into the first duplicated set
    else if (currentIndex < originalLength) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + originalLength);
    }
  };

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(nextSlide, 5000);
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
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoPlay();
  };

  const renderPaginationDots = () => {
    return (
      <div className={styles.pagination}>
        {coursesData.map((_, idx) => {
          // Calculate the true active index based on the original data length
          const activeDot = currentIndex % coursesData.length;
          return (
            <div 
              key={idx} 
              className={`${styles.dot} ${activeDot === idx ? styles.active : ''}`}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(idx + coursesData.length);
                startAutoPlay();
              }}
            />
          );
        })}
      </div>
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleKnowMore = (e, course) => {
    e.preventDefault();
    setSelectedProgram({ id: course.id, title: course.title });
    setIsModalOpen(true);
  };

  const programsList = coursesData.map(c => ({ id: c.id, title: c.title }));

  return (
    <div className={styles.sectionWrapper}>
      <div className={`${styles.bgGridDecoration} ${styles.bgGridLeft}`} />
      <div className={`${styles.bgGridDecoration} ${styles.bgGridRight}`} />

      <section className={styles.sectionContainer}>
        <h2 className={styles.heading}>
          Accelerate Your Career with Our <span className={styles.accentText}>Industry-Aligned</span> Courses
        </h2>

        <div 
          className={styles.carouselContainer}
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
        >
          <div className={`${styles.navButton} ${styles.navPrev}`} onClick={prevSlide}>
            <ArrowLeft size={20} />
          </div>
          
          <div 
            className={styles.carouselTrackWrapper}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className={styles.carouselTrack}
              onTransitionEnd={handleTransitionEnd}
              style={{ 
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
              }}
            >
              {extendedCourses.map((course, idx) => (
                <div key={`${course.id}-${idx}`} className={styles.cardSlide}>
                  <div className={styles.card}>
                    
                    <div className={styles.cardTop}>
                      <div className={styles.cardHeaderRow}>
                        <div className={styles.countdownWrapper}>
                          <span className={styles.countdownLabel}>Next batch starts in</span>
                          <CountdownTimer targetDate={course.batchStartDate} />
                        </div>
                        <div className={styles.seatsBadge}>
                          {course.seats} seats left
                        </div>
                      </div>

                      <div className={styles.illustrationWrapper}>
                        {course.illustration}
                      </div>

                      <div className={styles.techRow}>
                        {course.technologies.map((tech, i) => (
                          <div key={i} className={styles.techItem}>
                            <div className={styles.techIcon}>{tech.icon}</div>
                            <span className={styles.techName}>{tech.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.cardBottom}>
                      <div className={styles.badgesRow}>
                        {course.badges.map((badge, i) => (
                          <span key={i} className={`${styles.badge} ${i === 0 ? styles.badgeBlue : styles.badgeGreen}`}>
                            {badge}
                          </span>
                        ))}
                      </div>

                      <h3 className={styles.courseTitle}>{course.title}</h3>
                      <p className={styles.courseDescription}>{course.description}</p>

                      <div className={styles.spacer}></div>

                      <div className={styles.metaRow}>
                        <Clock size={16} className={styles.metaIcon} />
                        <span>{course.duration}</span>
                      </div>
                      
                      <div className={styles.metaDivider}></div>
                      
                      <div className={styles.metaRow}>
                        <Calendar size={16} className={styles.metaIcon} />
                        <span>{course.batch}</span>
                      </div>

                      <div className={styles.actionRow}>
                        <button onClick={(e) => handleKnowMore(e, course)} className={`${styles.btn} ${styles.btnBrochure}`}>
                          Download Brochure <FileText size={16} />
                        </button>
                        <button onClick={(e) => handleKnowMore(e, course)} className={`${styles.btn} ${styles.btnKnowMore}`}>
                          Know More <ArrowRightCircle size={16} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.navButton} ${styles.navNext}`} onClick={nextSlide}>
            <ArrowRight size={20} />
          </div>

          {renderPaginationDots()}
        </div>
      </section>

      <ProgramEnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        selectedProgramId={selectedProgram?.id}
        selectedProgramName={selectedProgram?.title}
        programsList={programsList}
      />
    </div>
  );
}
