import { useMemo } from 'react';
import styles from './PartnerInstitutes.module.css';
import AccreditationCard from './AccreditationCard';

// Automatically import all logos from the assets folder at build time
const logoModules = import.meta.glob('../assets/companies-logos/*.{png,jpg,jpeg,svg,webp}', { 
  eager: true, 
  import: 'default' 
});

export default function PartnerInstitutes() {
  const partnerLogos = useMemo(() => {
    return Object.entries(logoModules).map(([path, src]) => {
      // Extract a clean name from the filename for the alt text
      const filename = path.split('/').pop();
      const name = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      return {
        id: filename,
        name: name,
        src: src
      };
    });
  }, []);

  if (!partnerLogos || partnerLogos.length === 0) {
    return null; // Don't render if no logos are found
  }

  // We render the array twice in the DOM to create a seamless infinite scroll loop
  // The CSS animation translates exactly -50% to hide the first set and seamlessly start the second
  return (
    <section className={styles.partnerSection}>
      <div className={styles.layoutGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.headerArea}>
            <h2 className={styles.heading}>
              Programs and Opportunities in collaboration with{' '}
              <span className={styles.highlightWrapper}>
                <span className={styles.highlight}>Industry Partners</span>
                <div className={styles.underline}></div>
              </span>
            </h2>
            <p className={styles.subtitle}>
              Accelerating careers through exclusive pathways with top global organizations
            </p>
          </div>

          <div className={styles.sliderContainer} aria-hidden="true">
            <div className={styles.sliderTrack}>
              {/* First Group */}
              <div className={styles.logoGroup}>
                {partnerLogos.map((logo) => (
                  <div key={`group1-${logo.id}`} className={styles.logoItem}>
                    <img 
                      src={logo.src} 
                      alt={logo.name} 
                      className={styles.logoImage}
                      loading="lazy" 
                    />
                  </div>
                ))}
              </div>
              {/* Duplicated Group for Infinite Loop */}
              <div className={styles.logoGroup}>
                {partnerLogos.map((logo) => (
                  <div key={`group2-${logo.id}`} className={styles.logoItem}>
                    <img 
                      src={logo.src} 
                      alt={logo.name} 
                      className={styles.logoImage} 
                      loading="lazy" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <AccreditationCard logos={partnerLogos} />
        </div>
      </div>
    </section>
  );
}
