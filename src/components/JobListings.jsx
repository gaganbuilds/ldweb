import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../admin/services/supabase';
import { MapPin, Briefcase, Clock, IndianRupee, Search, Filter } from 'lucide-react';
import styles from './JobListings.module.css';

const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'today';
  if (diffInDays === 1) return 'yesterday';
  if (diffInDays < 30) return `${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return '1 month ago';
  return `${diffInMonths} months ago`;
};

const formatSalary = (min, max, currency) => {
  if (!min && !max) return '';
  const curr = currency === 'INR' ? '₹' : (currency === 'USD' ? '$' : currency);
  if (min && max) {
    if (min >= 100000) return `${curr}${min/100000}L – ${max/100000}L`;
    return `${curr}${min.toLocaleString()} – ${curr}${max.toLocaleString()}`;
  }
  if (min) {
    if (min >= 100000) return `${curr}${min/100000}L+`;
    return `${curr}${min.toLocaleString()}+`;
  }
  return '';
};

export default function JobListings({ initialCategory = null }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState(new Set());
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || 'all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
    // Load saved jobs from local storage for unauthenticated users for now
    const saved = JSON.parse(localStorage.getItem('ld_saved_jobs') || '[]');
    setSavedJobs(new Set(saved));
  }, [initialCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories for filter dropdown
      const { data: catData } = await supabase
        .from('job_categories')
        .select('id, name, slug')
        .eq('status', 'active');
      if (catData) setCategories(catData);

      // Fetch published jobs
      let query = supabase
        .from('jobs')
        .select(`
          *,
          job_categories(name, slug)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (initialCategory) {
        // If an initial category slug is provided, filter by it
        const cat = catData?.find(c => c.slug === initialCategory);
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }

      const { data: jobData, error } = await query;
      
      if (error) throw error;
      setJobs(jobData || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = (jobId) => {
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
    } else {
      newSaved.add(jobId);
    }
    setSavedJobs(newSaved);
    localStorage.setItem('ld_saved_jobs', JSON.stringify(Array.from(newSaved)));
  };

  // Derived state for filtering
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // We already filter by initialCategory in the DB query if it exists,
    // but this handles local dropdown filtering.
    const matchesCategory = categoryFilter === 'all' || 
                            job.job_categories?.slug === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getCategoryTitle = () => {
    if (initialCategory && categories.length > 0) {
      const cat = categories.find(c => c.slug === initialCategory);
      return cat ? `${cat.name} Jobs` : 'Job Listings';
    }
    return 'Explore Opportunities';
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Main Content (Left) */}
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h2 className={styles.title}>{getCategoryTitle()}</h2>
            {initialCategory && (
              <Link to="/careers/jobs" className={styles.viewAllLink}>
                View all jobs
              </Link>
            )}
          </div>

          {/* Simple Search/Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search job title or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {!initialCategory && (
              <select 
                className={styles.filterSelect}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className={styles.jobList}>
            {loading ? (
              <div className={styles.loadingState}>Loading jobs...</div>
            ) : filteredJobs.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No opportunities available right now</h3>
                <p>New opportunities are added regularly. Check back soon.</p>
                {categoryFilter !== 'all' && (
                  <button onClick={() => setCategoryFilter('all')} className={styles.clearBtn}>
                    View all careers
                  </button>
                )}
              </div>
            ) : (
              filteredJobs.map(job => (
                <div key={job.id} className={styles.jobRow}>
                  {/* Logo Area */}
                  <div className={styles.logoContainer}>
                    {job.company_logo_url ? (
                      <img src={job.company_logo_url} alt={job.company_name} className={styles.companyLogo} />
                    ) : (
                      <div className={styles.logoPlaceholder}>
                        {job.company_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  {/* Info Area */}
                  <div className={styles.jobInfo}>
                    <Link to={`/careers/jobs/${job.slug}`} className={styles.jobTitle}>
                      {job.title}
                    </Link>
                    <div className={styles.jobMeta}>
                      <span className={styles.companyName}>{job.company_name}</span>
                      <span className={styles.bullet}>&bull;</span>
                      
                      {job.work_mode && (
                        <>
                          <span className={styles.metaItem}>{job.work_mode}</span>
                          <span className={styles.bullet}>&bull;</span>
                        </>
                      )}
                      
                      {job.location && (
                        <>
                          <span className={styles.metaItem}>{job.location}</span>
                          <span className={styles.bullet}>&bull;</span>
                        </>
                      )}
                      
                      {job.salary_visible && job.salary_min && (
                        <>
                          <span className={styles.metaItem}>
                            {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                          </span>
                          <span className={styles.bullet}>&bull;</span>
                        </>
                      )}
                      
                      <span className={styles.metaItem}>{formatRelativeTime(job.published_at || job.created_at)}</span>
                    </div>
                  </div>
                  
                  {/* Actions Area */}
                  <div className={styles.jobActions}>
                    <button 
                      className={`${styles.saveBtn} ${savedJobs.has(job.id) ? styles.saved : ''}`}
                      onClick={() => handleSaveJob(job.id)}
                    >
                      {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                    </button>
                    <Link to={`/careers/jobs/${job.slug}`} className={styles.applyBtn}>
                      Apply
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarWidget}>
            <h3 className={styles.widgetTitle}>Find the right opportunity</h3>
            <p className={styles.widgetDesc}>
              Explore jobs by role, location, work mode and more.
            </p>
            <Link to="/careers/jobs" className={styles.widgetBtn}>
              Explore All Jobs
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
