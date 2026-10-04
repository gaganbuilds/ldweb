import { useEffect, useState, useMemo } from 'react';
import styles from './DataScienceImageWall.module.css';

export default function DataScienceImageWall() {
  // Use exact filenames from public/assets/test-photos which corresponds to /assets/test-photos/
  const filenames = ['i1.png', 'i2.png', 'i3.png', 'i4.png', 'i5.png', 'i6.png'];
  const images = filenames.map(name => `/assets/test-photos/${name}`);

  // If no images, render empty state or fallback
  if (!images || images.length === 0) {
    return <div className={styles.emptyWall}>No images found</div>;
  }

  // To create a seamless loop, we need enough images to fill the height.
  // We'll duplicate the images array to ensure it loops smoothly.
  // Using 3 repetitions to ensure there's always enough content to scroll without blank spaces.
  const column1Images = [...images, ...images, ...images];
  
  // For variety, shuffle or offset the second column
  const offsetImages = [...images.slice(Math.floor(images.length / 2)), ...images.slice(0, Math.floor(images.length / 2))];
  const column2Images = [...offsetImages, ...offsetImages, ...offsetImages];

  return (
    <div className={styles.wallContainer}>
      {/* Top and Bottom Fades */}
      <div className={styles.fadeTop}></div>
      <div className={styles.fadeBottom}></div>

      {/* Columns */}
      <div className={styles.columnsWrapper}>
        
        {/* Column 1: Moves Top to Bottom */}
        <div className={styles.column}>
          <div className={`${styles.track} ${styles.moveDown}`}>
            {column1Images.map((src, index) => (
              <div key={`col1-${index}`} className={styles.imageCard}>
                <img src={src} alt="Data Science Student" className={styles.image} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Moves Bottom to Top */}
        <div className={`${styles.column} ${styles.offsetColumn}`}>
          <div className={`${styles.track} ${styles.moveUp}`}>
            {column2Images.map((src, index) => (
              <div key={`col2-${index}`} className={styles.imageCard}>
                <img src={src} alt="LearnDepth Activity" className={styles.image} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
