import React from 'react';
import { Clock, Code2, BriefcaseBusiness, MessageCircle } from 'lucide-react';
import '../styles/ProgramKeyHighlights.css';

export default function ProgramKeyHighlights() {
  const highlights = [
    {
      value: '50+ Hours',
      title: 'Live Classes',
      description: 'Learn through structured live sessions with practical demonstrations and guided learning.',
      icon: <Clock size={28} />
    },
    {
      value: '20+ Projects',
      title: 'Build & Practice',
      description: 'Build practical machine learning projects and strengthen your real-world portfolio.',
      icon: <Code2 size={28} />
    },
    {
      value: '1 Month',
      title: 'Internship Included',
      description: 'Apply your learning through a structured internship experience and work on practical tasks.',
      icon: <BriefcaseBusiness size={28} />
    },
    {
      value: 'Unlimited',
      title: 'Doubt Support',
      description: 'Get continuous guidance and clarification whenever you get stuck.',
      icon: <MessageCircle size={28} />
    }
  ];

  return (
    <section className="ml-highlights-section">
      <h2 className="ml-highlights-heading">
        Program Key <span className="ml-highlights-heading-accent">Highlights</span>
      </h2>
      
      <div className="ml-highlights-container">
        <div className="ml-highlights-left">
          {highlights.map((item, index) => (
            <div className="ml-feature-item" key={index}>
              <div className="ml-feature-icon-wrapper">
                {item.icon}
              </div>
              <div className="ml-feature-content">
                <div className="ml-feature-value">{item.value}</div>
                <div className="ml-feature-title">{item.title}</div>
                <div className="ml-feature-desc">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="ml-highlights-right">
          <div className="ml-floating-card ml-card-1">
            <div className="ml-floating-card-value">8 LPA</div>
            <div className="ml-floating-card-label">Average Package</div>
          </div>
          
          <div className="ml-floating-card ml-card-2">
            <div className="ml-floating-card-value">45+</div>
            <div className="ml-floating-card-label">Hiring Partners</div>
          </div>
          
          <div className="ml-floating-card ml-card-3">
            <div className="ml-floating-card-value">100%</div>
            <div className="ml-floating-card-label">Job Assistance</div>
          </div>
          
          <div className="ml-highlights-image-wrapper">
            <img 
              src="/images/ml-highlights-woman.jpg" 
              alt="Young Indian woman technology professional with laptop" 
              className="ml-highlights-woman" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
