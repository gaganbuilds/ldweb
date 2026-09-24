import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../admin/services/supabase';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import styles from './BlogSlider.module.css';

export default function BlogSlider() {
  const fetchBlogs = useCallback(async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug, published_at, banner_image_url')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }, []);

  const { data: blogArticles, loading, error } = useSupabaseQuery(fetchBlogs, [], { retries: 3, initialData: [] });

  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  const autoPlayRef = useRef(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (blogArticles.length > 0) {
      setCurrentIndex(blogArticles.length);
    }
  }, [blogArticles]);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const originalLength = blogArticles.length;
  // Triplicate the array for seamless infinite loop [ 1-8, 1-8, 1-8 ]
  const extendedData = [...blogArticles, ...blogArticles, ...blogArticles];

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex >= originalLength * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - originalLength);
    } 
    else if (currentIndex < originalLength) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + originalLength);
    }
  };

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(nextSlide, 4500);
  }, [nextSlide]);

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && blogArticles.length > 0 && !loading) {
      startAutoPlay();
    }
    return stopAutoPlay;
  }, [startAutoPlay, currentIndex, blogArticles.length, loading]);

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const gap = 20;

  if (loading) {
    return (
      <section className={styles.sectionWrapper} aria-label="LearnDepth Blog Bytes">
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--text-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '16px' }}>Loading articles...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </section>
    );
  }

  if (error || blogArticles.length === 0) {
    return (
      <section className={styles.sectionWrapper} aria-label="LearnDepth Blog Bytes">
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--card-bg)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-primary)' }}>LearnDepth Bytes</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Check back soon for our latest articles!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className={styles.sectionWrapper} 
      aria-label="LearnDepth Blog Bytes"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className={styles.container}>
        
        <h2 className={styles.sectionHeader}>
          LearnDepth <span className={styles.accentWord}>Bytes</span>
        </h2>

        <div className={styles.carouselContainer}>
          <div className={styles.carouselViewport}>
            <div 
              className={styles.carouselTrack}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(calc(-${currentIndex * (100 / itemsPerPage)}% - ${currentIndex * (gap / itemsPerPage)}px))`,
                transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
              }}
            >
              {extendedData.map((article, idx) => (
                <div 
                  key={`${article.id}-${idx}`} 
                  className={styles.cardSlide}
                  style={{ width: `calc((100% - ${(itemsPerPage - 1) * gap}px) / ${itemsPerPage})` }}
                >
                  <Link to={`/blog/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles.blogCard}>
                      <div className={styles.cardImageWrapper}>
                        <img 
                          src={article.banner_image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop'} 
                          alt={article.title} 
                          className={styles.cardImage}
                          loading="lazy"
                        />
                      </div>
                      <div className={styles.cardContent}>
                        <div className={styles.cardTitleRow}>
                          <h3 className={styles.cardTitle} style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>{article.title}</h3>
                          <ArrowUpRight className={styles.arrowIcon} size={18} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        </div>
                        <div className={styles.cardDate}>{formatDate(article.published_at)}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.navControls}>
            <button 
              className={styles.navButton} 
              onClick={prevSlide}
              aria-label="Previous articles"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <button 
              className={styles.navButton} 
              onClick={nextSlide}
              aria-label="Next articles"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
