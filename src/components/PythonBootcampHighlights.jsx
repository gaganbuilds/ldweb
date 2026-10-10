import React from 'react';
import { Clock, Code2, BriefcaseBusiness, MessageCircle } from 'lucide-react';
import '../styles/ProgramKeyHighlights.css'; // Reusing the same CSS

export default function PythonBootcampHighlights() {
  const highlights = [
    {
      value: '30 Days',
      title: 'Structured Roadmap',
      description: 'Follow a clear, practical learning plan from Python foundations to internship preparation.',
      icon: <Clock size={28} />
    },
    {
      value: 'Hands-On',
      title: 'Practical Projects',
      description: 'Build practical applications and automation tools instead of only watching tutorials.',
      icon: <Code2 size={28} />
    },
    {
      value: 'GitHub Profile',
      title: 'Portfolio Development',
      description: 'Organize and present your work in a professional, recruiter-friendly repository structure.',
      icon: <BriefcaseBusiness size={28} />
    },
    {
      value: 'Weekly Live',
      title: 'Mega-Webinar',
      description: 'Join the scheduled Sunday evening session for doubt clearing, guidance, and resume reviews.',
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
            <div className="ml-floating-card-value">15-20</div>
            <div className="ml-floating-card-label">Hours of Learning</div>
          </div>
          
          <div className="ml-floating-card ml-card-2">
            <div className="ml-floating-card-value">Resume</div>
            <div className="ml-floating-card-label">Review Support</div>
          </div>
          
          <div className="ml-floating-card ml-card-3">
            <div className="ml-floating-card-value">Community</div>
            <div className="ml-floating-card-label">Peer Learning</div>
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
