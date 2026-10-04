import { useState } from 'react';
import styles from './HireTalentDomains.module.css';

// Automatically import all logos from the assets folder at build time
const logoModules = import.meta.glob('../assets/technology-logos/*.{png,jpg,jpeg,svg,webp}', { 
  eager: true, 
  import: 'default' 
});

// Helper to get logo by name
const getLogo = (name) => {
  const filename = `${name.toLowerCase()}.svg`;
  const pathKey = Object.keys(logoModules).find(key => key.endsWith(filename));
  return pathKey ? logoModules[pathKey] : null; 
};

const domainsData = {
  dataScience: {
    title: "DATA SCIENCE & AI",
    roles: [
      "Data Analyst", "Data Scientist", "Data Engineer", 
      "ML Engineer", "AI Engineer", "Business Analyst", "LLM Engineer"
    ],
    technologies: [
      { name: "Python", logo: "python" },
      { name: "Pandas", logo: "pandas" },
      { name: "NumPy", logo: "numpy" },
      { name: "Scikit-learn", logo: "scikitlearn" },
      { name: "TensorFlow", logo: "tensorflow" },
      { name: "SQL", logo: "sql" },
      { name: "Power BI", logo: "powerbi" },
      { name: "Tableau", logo: "tableau" }
    ]
  },
  webDevelopment: {
    title: "WEB DEVELOPMENT",
    roles: [
      "Frontend Developer", "Backend Developer", "Full Stack Developer",
      "React Developer", "Node.js Developer", "Python Developer", "Web Application Developer"
    ],
    technologies: [
      { name: "HTML5", logo: "html5" },
      { name: "CSS3", logo: "css3" },
      { name: "JavaScript", logo: "javascript" },
      { name: "React", logo: "react" },
      { name: "Node.js", logo: "nodejs" },
      { name: "Express.js", logo: "express" },
      { name: "MongoDB", logo: "mongodb" },
      { name: "Git", logo: "git" }
    ]
  },
  appDevelopment: {
    title: "APP DEVELOPMENT",
    roles: [
      "Android Developer", "Flutter Developer", "Mobile App Developer",
      "React Native Developer", "Cross-Platform App Developer", "Mobile UI Developer"
    ],
    technologies: [
      { name: "Flutter", logo: "flutter" },
      { name: "Dart", logo: "dart" },
      { name: "Android", logo: "android" },
      { name: "Kotlin", logo: "kotlin" },
      { name: "React Native", logo: "react" },
      { name: "Firebase", logo: "firebase" },
      { name: "REST APIs", logo: "javascript" }, // generic fallback to js or similar if needed
      { name: "Git", logo: "git" }
    ]
  },
  programming: {
    title: "PROGRAMMING & SOFTWARE",
    roles: [
      "Software Developer", "Python Developer", "Java Developer",
      "C++ Developer", "Backend Developer", "Software Engineer", "Junior Software Developer"
    ],
    technologies: [
      { name: "Python", logo: "python" },
      { name: "Java", logo: "java" },
      { name: "C", logo: "c" },
      { name: "C++", logo: "cplusplus" },
      { name: "JavaScript", logo: "javascript" },
      { name: "Git", logo: "git" },
      { name: "SQL", logo: "sql" },
      { name: "REST APIs", logo: "nodejs" } // generic fallback
    ]
  }
};

export default function HireTalentDomains() {
  const [activeKey, setActiveKey] = useState('dataScience');
  const activeDomain = domainsData[activeKey];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          We Train the Right Candidates for the <span className={styles.highlight}>Right Roles</span>
        </h2>

        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            {Object.entries(domainsData).map(([key, domain]) => (
              <button
                key={key}
                className={`${styles.tabButton} ${activeKey === key ? styles.activeTab : ''}`}
                onClick={() => setActiveKey(key)}
              >
                {domain.title}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.contentArea} key={activeKey}>
          <div className={styles.rolesRow}>
            {activeDomain.roles.map(role => (
              <div key={role} className={styles.roleChip}>
                {role}
              </div>
            ))}
          </div>

          <div className={styles.techGrid}>
            {activeDomain.technologies.map(tech => {
              const src = getLogo(tech.logo);
              return (
                <div key={tech.name} className={styles.techItem}>
                  <div className={styles.techLogoContainer}>
                    {src ? (
                      <img src={src} alt={`${tech.name} logo`} className={styles.techLogo} loading="lazy" />
                    ) : (
                      <div className={styles.fallbackLogo}>{tech.name.charAt(0)}</div>
                    )}
                  </div>
                  <span className={styles.techName}>{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
