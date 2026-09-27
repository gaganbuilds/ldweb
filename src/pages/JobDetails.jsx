import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { buildJobPostingSchema } from '../utils/schemaBuilders';
import { supabase } from '../admin/services/supabase';
import { 
  ArrowLeft, MapPin, Briefcase, Clock, 
  IndianRupee, Share2, Copy, Bookmark, 
  BookmarkCheck, Star, ChevronRight,
  Building2, GraduationCap, Calendar
} from 'lucide-react';
import styles from './JobDetails.module.css';

const formatSalary = (min, max, currency) => {
  if (!min && !max) return 'Not Disclosed';
  const curr = currency === 'INR' ? '₹' : (currency === 'USD' ? '$' : currency);
  if (min && max) {
    if (min >= 100000) return `${curr}${min/100000}L – ${max/100000}L`;
    return `${curr}${min.toLocaleString()} – ${curr}${max.toLocaleString()}`;
  }
  if (min) {
    if (min >= 100000) return `${curr}${min/100000}L+`;
    return `${curr}${min.toLocaleString()}+`;
  }
  return 'Not Disclosed';
};

const getDaysAgo = (dateStr) => {
  if (!dateStr) return 'Recently';
  const diffTime = Math.abs(new Date() - new Date(dateStr));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  if (diffDays <= 1) return 'Few hours ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  return '30+ days ago';
};

export default function JobDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchJobAndRelated();
    checkSavedStatus();
    // Scroll to top when slug changes
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchJobAndRelated = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`*, job_categories(name)`)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
        
      if (error) throw error;
      setJob(data);

      // Fetch related jobs in the same category
      if (data && data.category_id) {
        const { data: related } = await supabase
          .from('jobs')
          .select('id, title, slug, company_name, company_logo_url, experience_level, location, published_at, created_at')
          .eq('category_id', data.category_id)
          .eq('status', 'published')
          .neq('id', data.id)
          .limit(4);
        
        setRelatedJobs(related || []);
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkSavedStatus = () => {
    // Implement local storage fallback for unauthenticated users for now
    const savedJobs = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    setSaved(savedJobs.includes(slug));
  };

  const handleSaveToggle = () => {
    const savedJobs = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    if (saved) {
      const filtered = savedJobs.filter(j => j !== slug);
      localStorage.setItem('saved_jobs', JSON.stringify(filtered));
      setSaved(false);
    } else {
      savedJobs.push(slug);
      localStorage.setItem('saved_jobs', JSON.stringify(savedJobs));
      setSaved(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleApply = () => {
    if (job.application_method === 'external' && job.application_url) {
      window.open(job.application_url, '_blank');
    } else if (job.application_method === 'email' && job.contact_email) {
      window.location.href = `mailto:${job.contact_email}?subject=Application for ${job.title}`;
    } else {
      navigate(`/careers/jobs/${job.slug}/apply`);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>Loading job details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.notFoundContainer}>
            <h2>Job Not Found</h2>
            <p>This position may have been removed or is no longer available.</p>
            <Link to="/careers" className={styles.backBtn}>Browse All Jobs</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const postedDateStr = getDaysAgo(job.published_at || job.created_at);

  const breadcrumbs = [
    { name: 'Home', url: 'https://www.learndepthacademy.com' },
    { name: 'Careers', url: 'https://www.learndepthacademy.com/careers' },
    ...(job.job_categories ? [{ name: job.job_categories.name, url: `https://www.learndepthacademy.com/careers/category/${job.job_categories.name.toLowerCase().replace(/ /g, '-')}` }] : []),
    { name: job.title, url: `https://www.learndepthacademy.com/careers/jobs/${slug}` }
  ];

  return (
    <div className={styles.page}>
      <SEOHead 
        title={job.seo_title || `${job.title} at ${job.company_name} | Careers`}
        description={job.seo_description || job.short_description || `Apply for ${job.title} at ${job.company_name}`}
        canonicalUrl={job.canonical_url || `https://www.learndepthacademy.com/careers/jobs/${slug}`}
        robots={job.no_index ? 'noindex, nofollow' : 'index, follow'}
        ogType="website"
        ogImage={job.og_image || job.company_logo_url || '/logo.svg'}
        schema={buildJobPostingSchema(job)}
        breadcrumbs={breadcrumbs}
      />
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          
          <div className={styles.breadcrumbs}>
            <Link to="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link to="/careers" className={styles.breadcrumbLink}>Careers</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            {job.job_categories && (
              <>
                <Link to={`/careers/category/${job.job_categories.name.toLowerCase().replace(/ /g, '-')}`} className={styles.breadcrumbLink}>
                  {job.job_categories.name}
                </Link>
                <span className={styles.breadcrumbSeparator}>/</span>
              </>
            )}
            <span className={styles.breadcrumbCurrent}>{job.title}</span>
          </div>
          
          <div className={styles.contentGrid}>
            
            {/* LEFT COLUMN: MAIN CONTENT */}
            <div>
              
              {/* Job Header Card */}
              <div className={styles.card}>
                <div className={styles.jobHeaderTop}>
                  <div>
                    <h1 className={styles.jobTitle}>{job.title}</h1>
                    <div className={styles.companyName}>{job.company_name}</div>
                    
                    <div className={styles.jobPrimaryMeta}>
                      <div className={styles.metaItem}>
                        <Briefcase size={16} /> 
                        {job.experience_min !== null && job.experience_max !== null 
                          ? `${job.experience_min} – ${job.experience_max} Years`
                          : job.experience_level || 'Experience Not Specified'
                        }
                      </div>
                      <div className={styles.metaItem}>
                        <IndianRupee size={16} /> 
                        {job.salary_visible ? formatSalary(job.salary_min, job.salary_max, job.salary_currency) : 'Not Disclosed'}
                      </div>
                      {job.location && (
                        <div className={styles.metaItem}>
                          <MapPin size={16} /> {job.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {job.company_logo_url ? (
                    <img src={job.company_logo_url} alt={job.company_name} className={styles.companyLogo} />
                  ) : (
                    <div className={styles.logoPlaceholder}>
                      {job.company_name ? job.company_name.charAt(0).toUpperCase() : <Building2 size={32} />}
                    </div>
                  )}
                </div>
                
                <div className={styles.headerDivider} />
                
                <div className={styles.jobHeaderBottom}>
                  <div className={styles.postingInfo}>
                    <span>Posted: <strong>{postedDateStr}</strong></span>
                    {job.openings > 0 && (
                      <>
                        <span>•</span>
                        <span>Openings: <strong>{job.openings}</strong></span>
                      </>
                    )}
                  </div>
                  
                  <div className={styles.headerActions}>
                    <button className={styles.applyBtn} onClick={handleApply}>
                      Apply Now
                    </button>
                    <button 
                      className={`${styles.saveBtn} ${saved ? styles.saved : ''}`} 
                      onClick={handleSaveToggle}
                      title={saved ? "Unsave Job" : "Save Job"}
                    >
                      {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                    </button>
                    <button className={styles.saveBtn} onClick={handleCopyLink} title="Share Job">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Job Description Card */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Job description</h2>
                
                <div className={styles.richTextContainer}>
                  {job.short_description && (
                    <>
                      <h3>Job Summary</h3>
                      <p>{job.short_description}</p>
                    </>
                  )}
                  
                  {job.description && (
                    <div dangerouslySetInnerHTML={{ __html: job.description }} />
                  )}
                  
                  {job.responsibilities && (
                    <>
                      <h3>Responsibilities</h3>
                      <div dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
                    </>
                  )}
                  
                  {job.qualifications && (
                    <>
                      <h3>Qualifications</h3>
                      <div dangerouslySetInnerHTML={{ __html: job.qualifications }} />
                    </>
                  )}
                  
                  {job.required_skills && job.required_skills.length > 0 && (
                    <>
                      <h3>Key Skills</h3>
                      <div className={styles.skillsList}>
                        {job.required_skills.map((skill, i) => (
                          <span key={i} className={styles.skillTag}>{skill}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <div className={styles.sidebar}>
              
              {/* Sticky Apply Card for Desktop */}
              <div className={`${styles.card} ${styles.stickyApplyCard}`}>
                <h3>Ready to apply?</h3>
                <p>Take the next step in your career.</p>
                <button className={styles.fullApplyBtn} onClick={handleApply}>
                  Apply Now
                </button>
              </div>

              {/* Job Highlights */}
              <div className={styles.card}>
                <h3 className={styles.sidebarTitle}>Key Highlights</h3>
                
                {job.salary_visible && (job.salary_min || job.salary_max) && (
                  <div className={styles.highlightRow}>
                    <div className={styles.highlightIcon}><IndianRupee size={18} /></div>
                    <div className={styles.highlightContent}>
                      <div className={styles.highlightLabel}>Salary & Benefits</div>
                      <div className={styles.highlightValue}>
                        {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                      </div>
                    </div>
                  </div>
                )}
                
                {job.work_mode && (
                  <div className={styles.highlightRow}>
                    <div className={styles.highlightIcon}><Building2 size={18} /></div>
                    <div className={styles.highlightContent}>
                      <div className={styles.highlightLabel}>Work Mode</div>
                      <div className={styles.highlightValue}>{job.work_mode}</div>
                    </div>
                  </div>
                )}

                {job.employment_type && (
                  <div className={styles.highlightRow}>
                    <div className={styles.highlightIcon}><Clock size={18} /></div>
                    <div className={styles.highlightContent}>
                      <div className={styles.highlightLabel}>Employment Type</div>
                      <div className={styles.highlightValue}>{job.employment_type}</div>
                    </div>
                  </div>
                )}

                {job.application_deadline && (
                  <div className={styles.highlightRow}>
                    <div className={styles.highlightIcon}><Calendar size={18} /></div>
                    <div className={styles.highlightContent}>
                      <div className={styles.highlightLabel}>Application Deadline</div>
                      <div className={styles.highlightValue}>{job.application_deadline}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Related Jobs */}
              {relatedJobs.length > 0 && (
                <div className={styles.card}>
                  <h3 className={styles.sidebarTitle}>
                    {job.company_name} roles you might be interested in
                  </h3>
                  
                  <div>
                    {relatedJobs.map(rJob => (
                      <Link to={`/careers/jobs/${rJob.slug}`} key={rJob.id} className={styles.relatedJob}>
                        <div className={styles.relatedJobInfo}>
                          <h4 className={styles.relatedJobTitle}>{rJob.title}</h4>
                          <div className={styles.relatedJobMeta}>
                            <Briefcase size={14} /> 
                            <span>{rJob.experience_level || 'Not specified'}</span>
                          </div>
                          {rJob.location && (
                            <div className={styles.relatedJobMeta}>
                              <MapPin size={14} /> 
                              <span>{rJob.location}</span>
                            </div>
                          )}
                          <div className={styles.relatedJobPosted}>
                            Posted {getDaysAgo(rJob.published_at || rJob.created_at)}
                          </div>
                        </div>
                        {rJob.company_logo_url ? (
                          <img src={rJob.company_logo_url} alt="" className={styles.relatedJobLogo} />
                        ) : (
                          <div className={styles.relatedJobPlaceholder}>
                            {rJob.company_name ? rJob.company_name.charAt(0).toUpperCase() : <Building2 size={16} />}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
