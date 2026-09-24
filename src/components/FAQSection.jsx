import React, { useState, useEffect } from 'react';
import { supabase } from '../admin/services/supabase';
import { Plus, Minus } from 'lucide-react';
import styles from './FAQSection.module.css';
import faqIllustration from '../assets/faq_illustration.jpg';

export default function FAQSection({ page = "home" }) {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, [page]);

  async function fetchFaqs() {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error);
        return;
      }

      // Filter by page assignment (assuming page_assignment is a JSONB array of strings)
      if (data) {
        const filteredFaqs = data.filter(faq => {
          if (!faq.page_assignment) return false;
          // Check if page_assignment contains the current page
          try {
            const assignments = typeof faq.page_assignment === 'string' 
              ? JSON.parse(faq.page_assignment) 
              : faq.page_assignment;
            return Array.isArray(assignments) && assignments.includes(page);
          } catch (e) {
            return false;
          }
        });
        setFaqs(filteredFaqs);
      }
    } catch (err) {
      console.error('Unexpected error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  }

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 4);

  if (loading) return null;
  if (faqs.length === 0) return null; // Don't render if no FAQs for this page

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Everything You Need to Know About LearnDepth</h2>
          <p className={styles.subtitle}>
            Find answers to the most common questions about our programs, learning experience, internships, certifications and career support.
          </p>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.leftCol}>
            <div className={styles.imageWrapper}>
              <img src={faqIllustration} alt="LearnDepth FAQ and Learning Illustration" className={styles.illustration} />
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.accordion}>
              {visibleFaqs.map((faq, index) => {
                const isOpen = openId === faq.id;
                const displayNumber = String(index + 1).padStart(2, '0');
                
                return (
                  <div key={faq.id} className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ''}`}>
                    <button 
                      className={styles.faqButton} 
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                    >
                      <div className={styles.questionWrapper}>
                        <span className={styles.faqNumber}>{displayNumber}</span>
                        <span className={styles.faqQuestion}>{faq.question}</span>
                      </div>
                      <span className={styles.faqIcon}>
                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                      </span>
                    </button>
                    
                    <div 
                      id={`faq-answer-${faq.id}`}
                      className={`${styles.faqAnswer} ${isOpen ? styles.answerOpen : ''}`}
                    >
                      <div className={styles.answerContent}>
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {faqs.length > 4 && (
              <button 
                className={styles.showMoreBtn} 
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Fewer FAQs −' : 'Show More FAQs +'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
