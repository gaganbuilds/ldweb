import styles from './TopAnnouncementBar.module.css';

export default function TopAnnouncementBar() {
  return (
    <div className={styles.announcementBar}>
      <div className={styles.content}>
        <div className={styles.textGroup}>
          <span className={styles.textItem}>
            🚀 <strong>Introducing CodeDepth — Learn. Build. Grow.</strong>
          </span>
        </div>
        <a 
          href="https://codedepth.site" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'inherit',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px'
          }}
          className={styles.textItem}
        >
          codedepth.site &rarr;
        </a>
      </div>
    </div>
  );
}
