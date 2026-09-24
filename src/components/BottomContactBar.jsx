import React from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, MessageCircle } from 'lucide-react';
import styles from './BottomContactBar.module.css';

export default function BottomContactBar() {
  const location = useLocation();
  
  // Hide on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const whatsappMessage = encodeURIComponent("Hi, I want details about LearnDepth programs");
  const whatsappUrl = `https://wa.me/919980855683?text=${whatsappMessage}`;
  const callUrl = "tel:9980855683";

  return (
    <div className={styles.barContainer}>
      <div className={styles.content}>
        <span className={styles.mainText}>
          🎓 Need Help? Get Career Guidance
        </span>
        <div className={styles.actionGroup}>
          <a href={callUrl} className={styles.callBtn}>
            <Phone size={16} />
            Call Now
          </a>
          <a 
            href={whatsappUrl} 
            className={styles.whatsappBtn}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
