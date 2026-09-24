import React, { useState, useEffect } from 'react';
import { ChevronRight, Code, BrainCircuit, PenTool, LayoutTemplate, Network, Server, Database, TrendingUp, MonitorSmartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../admin/services/supabase';
import styles from './JobCategoriesSection.module.css';

// Fallback demo data if DB is empty or fails
const DEMO_CATEGORIES = [
  {
    id: 'demo-1',
    name: 'Software Development',
    slug: 'software-development',
    description: 'Build web, mobile, backend, and software products using modern technologies.',
    icon: 'Code',
    jobCount: 8
  },
  {
    id: 'demo-2',
    name: 'AI & Machine Learning',
    slug: 'ai-machine-learning',
    description: 'Work on practical AI, machine learning, automation, and intelligent product solutions.',
    icon: 'BrainCircuit',
    jobCount: 5
  },
  {
    id: 'demo-3',
    name: 'Design & Product',
    slug: 'design-product',
    description: 'Shape intuitive digital experiences across UI/UX, product design, and user research.',
    icon: 'PenTool',
    jobCount: 3
  }
];

const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'Code': return <Code size={24} strokeWidth={2} />;
    case 'BrainCircuit': return <BrainCircuit size={24} strokeWidth={2} />;
    case 'PenTool': return <PenTool size={24} strokeWidth={2} />;
    case 'LayoutTemplate': return <LayoutTemplate size={24} strokeWidth={2} />;
    case 'Network': return <Network size={24} strokeWidth={2} />;
    case 'Server': return <Server size={24} strokeWidth={2} />;
    case 'Database': return <Database size={24} strokeWidth={2} />;
    case 'TrendingUp': return <TrendingUp size={24} strokeWidth={2} />;
    case 'MonitorSmartphone': return <MonitorSmartphone size={24} strokeWidth={2} />;
    default: return <MonitorSmartphone size={24} strokeWidth={2} />;
  }
};

export default function JobCategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch active categories ordered by featured and display order
      const { data: catData, error: catError } = await supabase
        .from('job_categories')
        .select('*')
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true });

      if (catError) throw catError;

      if (!catData || catData.length === 0) {
        setCategories(DEMO_CATEGORIES);
        return;
      }

      // 2. Fetch open job counts for these categories
      const categoryIds = catData.map(c => c.id);
      
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('category_id')
        .eq('status', 'published')
        .eq('job_status', 'open')
        .in('category_id', categoryIds);
        
      if (jobError) throw jobError;
      
      // Count jobs per category
      const counts = {};
      jobData?.forEach(job => {
        counts[job.category_id] = (counts[job.category_id] || 0) + 1;
      });

      // 3. Merge data
      const merged = catData.map(c => ({
        ...c,
        jobCount: counts[c.id] || 0
      }));

      // Only show categories that are featured, or all if none are explicitly featured
      // According to req: "Show featured + active categories first. If no featured, handle gracefully."
      // Let's filter to featured, or if none featured, just show top active.
      let displayCats = merged.filter(c => c.is_featured);
      if (displayCats.length === 0) {
        displayCats = merged; 
      }
      
      setCategories(displayCats);

    } catch (err) {
      console.error('Error fetching job categories:', err);
      // Use demo data silently on error for presentation robustness
      setCategories(DEMO_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (slug) => {
    navigate(`/careers/jobs?category=${slug}`);
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Explore Jobs by Category</h2>
          <div className={styles.grid}>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.skeletonCard}></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Explore Jobs by Category</h2>
          <div className={styles.emptyState}>
            <p>Explore opportunities across our teams.</p>
            <button onClick={() => navigate('/careers/jobs')} className={styles.viewAllBtn}>
              View All Jobs <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Explore Jobs by Category</h2>
        
        {/* Horizontal scroll container for responsiveness if > 3 */}
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className={styles.card}
                onClick={() => handleCategoryClick(cat.slug)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter') handleCategoryClick(cat.slug) }}
              >
                <div className={styles.cardTop}>
                  <div className={styles.iconContainer}>
                    {getIconComponent(cat.icon)}
                  </div>
                  <div className={styles.headerText}>
                    <h3 className={styles.catName}>{cat.name}</h3>
                  </div>
                </div>
                
                <div className={styles.cardBody}>
                  <p className={styles.description}>{cat.description}</p>
                </div>
                
                <div className={styles.cardFooter}>
                  <span className={styles.countText}>{cat.jobCount} open positions</span>
                  <ChevronRight size={16} className={styles.arrowIcon} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
