import React, { useState, useEffect } from 'react';
import styles from './AIWorkshopCTA.module.css';

// Import existing Course Icons
import {
  PythonIcon, TensorFlowIcon, PyTorchIcon, ScikitLearnIcon,
  OpenAIIcon, LangChainIcon, HuggingFaceIcon, PandasIcon, NumPyIcon
} from './CourseIcons';

// Import specific AI Concept Icons
import {
  ComputerVisionIcon, NLPIcon, DeepLearningIcon, AIAgentsIcon, MachineLearningIcon
} from './AITechIcons';

const workshopStats = [
  { value: "20+", label: "Workshops Conducted" },
  { value: "10K+", label: "Students Trained" },
  { value: "4.9/5", label: "Average Rating" }
];

const technologySlides = [
  {
    id: 1,
    items: [
      { name: "Python", icon: <PythonIcon />, center: false },
      { name: "TensorFlow", icon: <TensorFlowIcon />, center: false },
      { name: "Computer Vision", icon: <ComputerVisionIcon />, center: true }, // Highlighted matching reference
      { name: "PyTorch", icon: <PyTorchIcon />, center: false },
      { name: "scikit-learn", icon: <ScikitLearnIcon />, center: false }
    ]
  },
  {
    id: 2,
    items: [
      { name: "Generative AI", icon: <OpenAIIcon />, center: false },
      { name: "OpenAI", icon: <OpenAIIcon />, center: false },
      { name: "LangChain", icon: <LangChainIcon />, center: true }, // Center focus
      { name: "Hugging Face", icon: <HuggingFaceIcon />, center: false },
      { name: "LLMs", icon: <NLPIcon />, center: false }
    ]
  },
  {
    id: 3,
    items: [
      { name: "Data & Vision", icon: <PandasIcon />, center: false },
      { name: "Pandas", icon: <PandasIcon />, center: false },
      { name: "Machine Learning", icon: <MachineLearningIcon />, center: true }, // Center focus
      { name: "NumPy", icon: <NumPyIcon />, center: false },
      { name: "OpenCV", icon: <ComputerVisionIcon />, center: false }
    ]
  },
  {
    id: 4,
    items: [
      { name: "Modern AI", icon: <AIAgentsIcon />, center: false },
      { name: "NLP", icon: <NLPIcon />, center: false },
      { name: "Deep Learning", icon: <DeepLearningIcon />, center: true }, // Center focus
      { name: "AI Agents", icon: <AIAgentsIcon />, center: false },
      { name: "Gen AI", icon: <OpenAIIcon />, center: false }
    ]
  }
];

export default function AIWorkshopCTA() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval;
    if (!isHovered) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % technologySlides.length);
      }, 3000); // Transitions every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className={styles.sectionWrapper}>
      {/* Background decorations */}
      <div className={styles.bgGradient}></div>
      <div className={styles.bgCircuit}></div>

      {/* Free Ribbon */}
      <div className={styles.freeRibbon}>
        <span>FREE</span>
      </div>

      <div className={styles.container}>
        {/* Left Content */}
        <div className={styles.leftContent}>
          <h2 className={styles.heading}>
            <span className={styles.accentText}>Master AI</span> for a Future-Ready Career
          </h2>
          <p className={styles.description}>
            Explore practical AI workshops designed to help students understand emerging technologies, build real skills and prepare for the future of work.
          </p>

          <div className={styles.statsRow}>
            {workshopStats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>

          <a href="#" className={styles.ctaBtn}>Explore AI Workshops</a>
        </div>

        {/* Right Content - Tech Slider */}
        <div 
          className={styles.rightContent}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div className={styles.sliderContainer}>
            {technologySlides.map((slide, index) => (
              <div 
                key={slide.id} 
                className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
              >
                {slide.items.map((item, itemIdx) => (
                  <div key={itemIdx} className={`${styles.iconWrapper} ${item.center ? styles.center : ''}`}>
                    <div className={styles.iconSvg}>
                      {item.icon}
                    </div>
                    <span className={styles.iconLabel}>{item.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
