import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import '../styles/PythonBootcampValueStack.css';

export default function PythonBootcampValueStack() {
  return (
    <section className="pb-value-section">
      <div className="pb-value-container">
        <h2 className="pb-value-heading">
          Everything You Need to <span className="pb-value-accent">Start Your Python Journey</span>
        </h2>
        <p className="pb-value-subheading">
          A focused learning experience designed to help you move from basic Python knowledge to practical projects and internship preparation.
        </p>

        <div className="pb-value-card">
          <div className="pb-value-items">
            <div className="pb-value-item pb-core">
              <div className="pb-value-item-left">
                <CheckCircle2 size={24} className="pb-check-icon" />
                <span className="pb-value-item-name"><strong>Core Program</strong> — 30-Day Industry Python Blueprint</span>
              </div>
              <div className="pb-value-item-price">Value: ₹1,999</div>
            </div>
            <div className="pb-value-item">
              <div className="pb-value-item-left">
                <CheckCircle2 size={24} className="pb-check-icon" />
                <span className="pb-value-item-name"><strong>Bonus 1</strong> — Three High-Impact GitHub Project Templates</span>
              </div>
              <div className="pb-value-item-price">Value: ₹999</div>
            </div>
            <div className="pb-value-item">
              <div className="pb-value-item-left">
                <CheckCircle2 size={24} className="pb-check-icon" />
                <span className="pb-value-item-name"><strong>Bonus 2</strong> — ATS-Friendly Tech Resume Template</span>
              </div>
              <div className="pb-value-item-price">Value: ₹499</div>
            </div>
            <div className="pb-value-item">
              <div className="pb-value-item-left">
                <CheckCircle2 size={24} className="pb-check-icon" />
                <span className="pb-value-item-name"><strong>Bonus 3</strong> — Cold-Email Guide for Off-Campus Internships</span>
              </div>
              <div className="pb-value-item-price">Value: ₹500</div>
            </div>
          </div>

          <div className="pb-value-summary">
            <div className="pb-value-total">Total Displayed Value: <span className="strike">₹3,997</span></div>
            <div className="pb-value-launch">
              Launch Price: <strong>₹399</strong> <span className="pb-value-onetime">(One-Time Payment)</span>
            </div>
          </div>

          <button 
            className="pb-value-cta"
            onClick={() => {
              const formSection = document.getElementById('python-bootcamp-form');
              if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get the Complete Bootcamp for ₹399 <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
