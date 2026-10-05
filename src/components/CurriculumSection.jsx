import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { mlCurriculumData } from '../data/mlCurriculumData';
import '../styles/CurriculumSection.css';

export default function CurriculumSection() {
  const [openModule, setOpenModule] = useState("module-1");

  const handleToggle = (id) => {
    setOpenModule(openModule === id ? null : id);
  };

  return (
    <section className="ld-curriculum-section">
      <div className="ld-curriculum-container">
        
        {/* Section Heading */}
        <div className="ld-curriculum-header">
          <h2 className="ld-curriculum-title">
            Learning <span className="ld-curriculum-highlight">Track</span>
          </h2>
          <p className="ld-curriculum-subtitle">
            From Python foundations to real-world Machine Learning deployment.
          </p>
          <p className="ld-curriculum-intro">
            Follow a structured 12-week journey covering Python, data analysis, Machine Learning, Deep Learning, deployment and career readiness.
          </p>
        </div>

        {/* Summary Row */}
        <div className="ld-curriculum-summary-wrapper">
          <div className="ld-curriculum-stats">
            <span className="ld-stat-item"><span className="ld-stat-num">12</span> Weeks</span>
            <span className="ld-stat-divider">•</span>
            <span className="ld-stat-item"><span className="ld-stat-num">4</span> Modules</span>
            <span className="ld-stat-divider">•</span>
            <span className="ld-stat-item"><span className="ld-stat-num">20+</span> Topics</span>
            <span className="ld-stat-divider">•</span>
            <span className="ld-stat-item"><span className="ld-stat-num">10+</span> Practical Projects</span>
          </div>
          <a href="#" className="ld-brochure-link">
            <Download size={16} className="ld-brochure-icon" />
            Download Brochure
          </a>
        </div>

        {/* Main Curriculum Accordion */}
        <div className="ld-curriculum-accordion-box">
          {mlCurriculumData.map((mod) => {
            const isOpen = openModule === mod.id;
            return (
              <div key={mod.id} className={`ld-module-item ${isOpen ? 'open' : ''}`}>
                
                {/* Module Header */}
                <button 
                  className="ld-module-header" 
                  onClick={() => handleToggle(mod.id)}
                  aria-expanded={isOpen}
                  aria-controls={`content-${mod.id}`}
                >
                  <div className="ld-module-header-left">
                    <div className="ld-module-chevron">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    <div className="ld-module-title-wrapper">
                      <span className="ld-module-num">{mod.moduleNum} : </span>
                      <span className="ld-module-name">{mod.title}</span>
                    </div>
                  </div>
                  <div className="ld-module-header-right">
                    <span className="ld-module-label">{mod.label}</span>
                    <span className="ld-module-duration">{mod.duration}</span>
                  </div>
                </button>

                {/* Module Content */}
                <div 
                  id={`content-${mod.id}`}
                  className="ld-module-content-wrapper"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="ld-module-content-inner">
                    <div className="ld-module-desc">
                      {mod.description}
                    </div>
                    
                    <div className="ld-module-weeks">
                      {mod.weeks.map((week, index) => (
                        <div key={index} className="ld-week-row">
                          
                          {/* Timeline Marker */}
                          <div className="ld-week-timeline">
                            <div className="ld-week-marker">{week.week}</div>
                            {index < mod.weeks.length - 1 && <div className="ld-week-line"></div>}
                          </div>

                          {/* Week Content */}
                          <div className="ld-week-content">
                            <div className="ld-week-header">
                              <div className="ld-week-name">Week {week.week}</div>
                              <h4 className="ld-week-focus">{week.focus}</h4>
                            </div>
                            
                            <div className="ld-week-details">
                              <div className="ld-week-learn">
                                {week.learn}
                              </div>
                              <div className="ld-week-output-box">
                                <span className="ld-output-label">PRACTICAL OUTPUT</span>
                                <div className="ld-output-title">{week.output}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
