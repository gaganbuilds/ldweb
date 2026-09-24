import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { testimonialService } from '../admin/services/testimonialService';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import styles from './LearnerTestimonials.module.css';

export default function LearnerTestimonials() {
  const { data: testimonialsData, loading: isLoading, error } = useSupabaseQuery(
    testimonialService.getPublicTestimonials,
    [],
    { retries: 3, initialData: [] }
  );

  const [itemsPerPage, setItemsPerPage] = useState(3);
  
  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  const autoPlayRef = useRef(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (testimonialsData.length > 0) {
      setCurrentIndex(testimonialsData.length);
    }
  }, [testimonialsData]);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const originalLength = testimonialsData.length;

  // Triplicate the array for seamless infinite loop [ 1-9, 1-9, 1-9 ]
  const extendedData = originalLength > 0 ? [...testimonialsData, ...testimonialsData, ...testimonialsData] : [];

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + itemsPerPage);
  }, [itemsPerPage]);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - itemsPerPage);
  }, [itemsPerPage]);

  const handleTransitionEnd = () => {
    // If we scrolled past the middle set into the right duplicate
    if (currentIndex >= originalLength * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - originalLength);
    } 
    // If we scrolled backwards into the left duplicate
    else if (currentIndex < originalLength) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + originalLength);
    }
  };

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(nextSlide, 5000);
  }, [nextSlide]);

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      startAutoPlay();
    }
    return stopAutoPlay;
  }, [startAutoPlay, currentIndex]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    stopAutoPlay();
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoPlay();
  };

  // Math for dot indicators
  const totalPages = Math.ceil(originalLength / itemsPerPage);
  // Map current index back to 0-based index of the original array, then find page
  const activeDotIndex = Math.round((currentIndex % originalLength) / itemsPerPage);

  const goToPage = (pageIndex) => {
    setIsTransitioning(true);
    // Move relative to the current block of originalLength
    const blockStart = Math.floor(currentIndex / originalLength) * originalLength;
    setCurrentIndex(blockStart + (pageIndex * itemsPerPage));
  };

  const gap = 24;
  
  const getInitials = (name) => {
    if (!name) return 'LD';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  if (isLoading) {
    return (
      <section className={styles.sectionWrapper} aria-label="Learner Testimonials">
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--text-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '16px' }}>Loading testimonials...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </section>
    );
  }

  if (error || originalLength === 0) {
    // Graceful fallback if no testimonials exist or error occurs
    return (
      <section className={styles.sectionWrapper} aria-label="Learner Testimonials">
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--card-bg)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-primary)' }}>Student Experiences</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Check back later for inspiring stories from our learners!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className={styles.sectionWrapper} 
      aria-label="Learner Testimonials"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className={styles.container}>
        <p className={styles.sectionIntro}>
          Real experiences shared by learners in the LearnDepth community.
        </p>

        <div className={styles.carouselContainer}>
          
          <button 
            className={`${styles.navButton} ${styles.prevButton}`} 
            onClick={prevSlide}
            aria-label="Previous testimonials"
          >
            <ArrowLeft size={24} />
          </button>

          <div className={styles.carouselViewport}>
            <div 
              className={styles.carouselTrack}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTransitionEnd={handleTransitionEnd}
              style={{
                // Move track by (100% of container / itemsPerPage + gap) * currentIndex
                transform: `translateX(calc(-${currentIndex * (100 / itemsPerPage)}% - ${currentIndex * (gap / itemsPerPage)}px))`,
                transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
              }}
            >
              {extendedData.map((testimonial, idx) => (
                <div 
                  key={`${testimonial.id}-${idx}`} 
                  className={styles.cardSlide}
                  style={{ width: `calc((100% - ${(itemsPerPage - 1) * gap}px) / ${itemsPerPage})` }}
                >
                  <div className={styles.testimonialCard}>
                    
                    {/* Header: Avatar, Name, LinkedIn */}
                    <div className={styles.cardHeader}>
                      <div className={styles.avatar}>
                        {testimonial.profile_image_url ? (
                          <img src={testimonial.profile_image_url} alt={testimonial.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          getInitials(testimonial.name)
                        )}
                      </div>
                      <div className={styles.headerText}>
                        <div className={styles.learnerName}>{testimonial.name}</div>
                        <div className={styles.learnerRole}>{testimonial.bio}</div>
                      </div>
                      <a href={testimonial.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                        <svg 
                          className={styles.linkedinIcon} 
                          width="24" height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    </div>

                    {/* Post Content */}
                    <div className={styles.category}>{testimonial.category}</div>
                    
                    <div className={styles.postContent}>
                      {testimonial.content}
                      
                      {testimonial.tags && testimonial.tags.length > 0 && (
                        <div className={styles.tagsContainer}>
                          {testimonial.tags.map(tag => (
                            <span key={tag} className={styles.tagPill}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className={`${styles.navButton} ${styles.nextButton}`} 
            onClick={nextSlide}
            aria-label="Next testimonials"
          >
            <ArrowRight size={24} />
          </button>

        </div>

        {/* Pagination Dots */}
        <div className={styles.dotsContainer}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeDotIndex ? styles.dotActive : ''}`}
              onClick={() => goToPage(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === activeDotIndex ? 'true' : 'false'}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
