import React from 'react';
import '../styles/StudentSuccessGallery.css';

const col1Images = ['i1.png', 'i4.png', 'i7.png', 'i10.png'];
const col2Images = ['i2.png', 'i5.png', 'i8.png', 'i11.png'];
const col3Images = ['i3.png', 'i6.png', 'i9.png', 'i1.png'];

const basePath = '/assets/test-photos/';

export default function StudentSuccessGallery() {
  return (
    <section className="ld-success-section">
      <div className="ld-success-container">
        
        {/* Left Content Area */}
        <div className="ld-success-left">
          <h2 className="ld-success-title">
            LearnDepth Students Are <br/>
            <span className="ld-success-highlight">Building Their Future</span>
          </h2>
          <p className="ld-success-desc">
            Real outcomes from students who learned, built and moved forward with LearnDepth.
          </p>
          
          <div className="ld-success-stats">
            <div className="ld-stat-block">
              <h3 className="ld-stat-number">2800+</h3>
              <p className="ld-stat-text">Students Completed<br/>Their Internship</p>
            </div>
            
            <div className="ld-stat-block">
              <h3 className="ld-stat-number">4000+</h3>
              <p className="ld-stat-text">Projects Built by<br/>Our Students</p>
            </div>
            
            <div className="ld-stat-block">
              <h3 className="ld-stat-number">20%</h3>
              <p className="ld-stat-text">Opportunities Found<br/>Through Our Students</p>
            </div>
          </div>
        </div>

        {/* Right Image Wall */}
        <div className="ld-success-right">
          <div className="ld-image-wall-mask">
            
            {/* Column 1 (Moves UP) */}
            <div className="ld-image-col">
              <div className="ld-image-track track-up col-1-speed">
                {col1Images.map((img, i) => (
                  <img key={`col1-a-${i}`} src={`${basePath}${img}`} alt="LearnDepth student working on project" className="ld-success-img" loading="lazy" />
                ))}
                {/* Duplicate for infinite scroll */}
                {col1Images.map((img, i) => (
                  <img key={`col1-b-${i}`} src={`${basePath}${img}`} alt="LearnDepth student working on project" className="ld-success-img" loading="lazy" />
                ))}
              </div>
            </div>

            {/* Column 2 (Moves DOWN) */}
            <div className="ld-image-col">
              <div className="ld-image-track track-down col-2-speed">
                {col2Images.map((img, i) => (
                  <img key={`col2-a-${i}`} src={`${basePath}${img}`} alt="LearnDepth student working on project" className="ld-success-img" loading="lazy" />
                ))}
                {/* Duplicate for infinite scroll */}
                {col2Images.map((img, i) => (
                  <img key={`col2-b-${i}`} src={`${basePath}${img}`} alt="LearnDepth student working on project" className="ld-success-img" loading="lazy" />
                ))}
              </div>
            </div>

            {/* Column 3 (Moves UP) */}
            <div className="ld-image-col">
              <div className="ld-image-track track-up col-3-speed">
                {col3Images.map((img, i) => (
                  <img key={`col3-a-${i}`} src={`${basePath}${img}`} alt="LearnDepth student working on project" className="ld-success-img" loading="lazy" />
                ))}
                {/* Duplicate for infinite scroll */}
                {col3Images.map((img, i) => (
                  <img key={`col3-b-${i}`} src={`${basePath}${img}`} alt="LearnDepth student working on project" className="ld-success-img" loading="lazy" />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
