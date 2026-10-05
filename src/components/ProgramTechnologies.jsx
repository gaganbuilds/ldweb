import React from 'react';
import '../styles/ProgramTechnologies.css';

const techData = [
  { name: 'Python', iconClass: 'devicon-python-plain colored' },
  { name: 'TensorFlow', iconClass: 'devicon-tensorflow-original colored' },
  { name: 'PyTorch', iconClass: 'devicon-pytorch-original colored' },
  { name: 'Scikit-Learn', iconClass: 'devicon-scikitlearn-plain colored' },
  { name: 'Pandas', iconClass: 'devicon-pandas-original colored' },
  { name: 'NumPy', iconClass: 'devicon-numpy-original colored' },
  { name: 'Keras', iconClass: 'devicon-keras-plain colored' },
  { name: 'OpenCV', iconClass: 'devicon-opencv-plain colored' },
  { name: 'Jupyter', iconClass: 'devicon-jupyter-plain colored' },
  { name: 'FastAPI', iconClass: 'devicon-fastapi-plain colored' },
  { name: 'SQL', iconClass: 'devicon-mysql-plain colored' },
  { name: 'Git', iconClass: 'devicon-git-plain colored' },
  { name: 'Docker', iconClass: 'devicon-docker-plain colored' },
  { name: 'Bash', iconClass: 'devicon-bash-plain colored' },
  { name: 'VS Code', iconClass: 'devicon-vscode-plain colored' }
];

export default function ProgramTechnologies() {
  return (
    <section className="ml-tech-section">
      <div className="ml-tech-container">
        <div className="ml-tech-header">
          <h2 className="ml-tech-title">Tools & <span className="ml-tech-highlight">Technologies</span></h2>
        </div>

        <div className="ml-tech-grid">
          {techData.map((tech, index) => (
            <div key={index} className="ml-tech-card">
              <div className="ml-tech-icon-wrapper">
                <i className={tech.iconClass}></i>
              </div>
              <h3 className="ml-tech-name">{tech.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
