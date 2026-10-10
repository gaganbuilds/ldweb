import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import '../styles/CurriculumSection.css'; // Reusing CSS

const pythonBootcampCurriculumData = [
  {
    id: "week-1",
    moduleNum: "Week 1",
    title: "Clean Code & Logic",
    label: "Foundation",
    duration: "1 Week",
    description: "Focus on Python fundamentals, logical thinking, and writing readable code.",
    weeks: [
      {
        week: "1",
        focus: "Fundamentals & Logic",
        learn: "Variables, conditions, loops, and functions. Lists and dictionaries. Basic data structures and entry-level algorithmic problem-solving. Writing readable and maintainable code.",
        output: "Command-Line Expense Tracker - Build an interactive command-line application to record, view, and manage expenses."
      }
    ]
  },
  {
    id: "week-2",
    moduleNum: "Week 2",
    title: "Industry Tech Stack: APIs & Automation",
    label: "Practical Python",
    duration: "1 Week",
    description: "Learn to read technical documentation, work with JSON, and interact with web services.",
    weeks: [
      {
        week: "2",
        focus: "APIs & Web Scraping",
        learn: "Reading technical documentation. JSON data. HTTP request basics. The `requests` library. Working with public APIs. Web scraping fundamentals using BeautifulSoup. Practical automation scripts.",
        output: "Live API Dashboard or Automation Tool - Build a weather dashboard, a crypto-price tracker, or an appropriate automation script."
      }
    ]
  },
  {
    id: "week-3",
    moduleNum: "Week 3",
    title: "Professional Workflow: Git & GitHub",
    label: "Portfolio Building",
    duration: "1 Week",
    description: "Master version control and present your code professionally.",
    weeks: [
      {
        week: "3",
        focus: "Version Control & GitHub",
        learn: "Git fundamentals. Repositories and commits. Branching and merging. Pull requests. README writing. Repository organization. Basic collaboration and open-source workflow. Creating a clean GitHub profile.",
        output: "A Professional Python GitHub Portfolio - Organize and publish your projects with useful documentation and clear descriptions."
      }
    ]
  },
  {
    id: "week-4",
    moduleNum: "Week 4",
    title: "Internship Applications & Interview Preparation",
    label: "Career Readiness",
    duration: "1 Week",
    description: "Prepare to apply for entry-level internships and learn how to position yourself.",
    weeks: [
      {
        week: "4",
        focus: "Resumes & Interviews",
        learn: "ATS-friendly resume structure. Resume optimization for entry-level Python roles. Cold-email strategies for off-campus internship applications. Common Python interview questions. OOP fundamentals. Python memory-management concepts. Project explanation.",
        output: "An Internship-Application-Ready Portfolio - Prepare a portfolio link, resume, project descriptions, and a plan for applying to relevant internships."
      }
    ]
  }
];

export default function PythonBootcampCurriculum() {
  const [openModule, setOpenModule] = useState("week-1");

  const handleToggle = (id) => {
    setOpenModule(openModule === id ? null : id);
  };

  return (
    <section className="ld-curriculum-section" id="curriculum-section">
      <div className="ld-curriculum-container">
        
        {/* Section Heading */}
        <div className="ld-curriculum-header">
          <h2 className="ld-curriculum-title">
            Learning <span className="ld-curriculum-highlight">Track</span>
          </h2>
          <p className="ld-curriculum-subtitle">
            A focused 30-day learning sprint designed for practical implementation.
          </p>
          <p className="ld-curriculum-intro">
            Follow a structured 4-week journey covering Python fundamentals, APIs, automation, version control, and internship preparation.
          </p>
        </div>

        {/* Summary Row */}
        <div className="ld-curriculum-summary-wrapper">
          <div className="ld-curriculum-stats">
            <span className="ld-stat-item"><span className="ld-stat-num">30</span> Days</span>
            <span className="ld-stat-divider">•</span>
            <span className="ld-stat-item"><span className="ld-stat-num">4</span> Weeks</span>
            <span className="ld-stat-divider">•</span>
            <span className="ld-stat-item"><span className="ld-stat-num">15-20</span> Hours of Learning</span>
            <span className="ld-stat-divider">•</span>
            <span className="ld-stat-item"><span className="ld-stat-num">4+</span> Practical Outcomes</span>
          </div>
          <button 
            className="ld-brochure-link"
            onClick={(e) => {
              e.preventDefault();
              const formSection = document.getElementById('python-bootcamp-form');
              if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Apply Now
          </button>
        </div>

        {/* Main Curriculum Accordion */}
        <div className="ld-curriculum-accordion-box">
          {pythonBootcampCurriculumData.map((mod) => {
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
