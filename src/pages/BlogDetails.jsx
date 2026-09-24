import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, Share2, Tag } from 'lucide-react';
import { blogService } from '../admin/services/blogService';
import { cmsService } from '../admin/services/cmsService';
import Navbar from '../components/Navbar';
import BlogSlider from '../components/BlogSlider';
import CareerCTASection from '../components/CareerCTASection';
import styles from './BlogDetails.module.css';

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState([]);
  const [parsedContent, setParsedContent] = useState('');

  useEffect(() => {
    fetchBlogData();
  }, [slug]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      
      // Fetch blog and ads in parallel
      const [blogData, adsData] = await Promise.all([
        blogService.getBlogBySlug(slug),
        cmsService.getAds()
      ]);
      
      setBlog(blogData);
      setAds(adsData.filter(ad => ad.status === 'active'));
      
      // Increment views
      await blogService.incrementViews(blogData.id);
      
      // Parse content for TOC and add IDs to headings
      processContent(blogData.content);
      
    } catch (err) {
      console.error(err);
      setError('Article not found.');
    } finally {
      setLoading(false);
    }
  };

  const processContent = (htmlContent) => {
    if (!htmlContent) return;
    
    // Create a dummy DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const headings = doc.querySelectorAll('h2, h3');
    const extractedToc = [];
    
    headings.forEach((heading) => {
      const title = heading.textContent;
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      heading.id = id;
      
      extractedToc.push({
        level: parseInt(heading.tagName.substring(1)),
        title,
        id
      });
    });
    
    setToc(extractedToc);
    setParsedContent(doc.body.innerHTML);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) return <div><Navbar /><div style={{ padding: '100px', textAlign: 'center' }}>Loading article...</div></div>;
  if (error || !blog) return <div><Navbar /><div style={{ padding: '100px', textAlign: 'center' }}>Article not found.</div></div>;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '0' }}>
      <Navbar />
      
      <main className={styles.blogLayout}>
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link> &gt; <Link to="/blog">Blog</Link> &gt; {blog.category?.name || 'Uncategorized'} &gt; {blog.title}
        </div>

        <h1 className={styles.title}>{blog.title}</h1>

        <div className={styles.meta}>
          <div className={styles.authorInfo}>
            By <span className={styles.authorName}>{blog.author?.name || 'LearnDepth Team'}</span> | Last updated on {formatDate(blog.published_at || blog.updated_at)} | {blog.views} Views
          </div>
          <div className={styles.metaRight}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6b7280' }}>
              <Bookmark size={20} />
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6b7280' }}>
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {blog.featured_image_url && (
          <img src={blog.featured_image_url} alt={blog.title} className={styles.bannerImage} style={{ borderRadius: '12px', marginTop: '24px' }} />
        )}

        <div className={styles.contentWrapper}>
          
          {/* Left TOC */}
          <aside className={styles.tocSidebar}>
            {toc.length > 0 && (
              <>
                <div className={styles.tocTitle}>Table of Content:</div>
                <ul className={styles.tocList}>
                  {toc.map((item, index) => (
                    <li key={index} className={styles.tocItem} style={{ paddingLeft: item.level === 3 ? '16px' : '0' }}>
                      <a href={`#${item.id}`}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            
            {/* Display Tags */}
            {blog.blog_tag_relations && blog.blog_tag_relations.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <div className={styles.tocTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={16} /> Tags
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {blog.blog_tag_relations.map(rel => (
                    <span key={rel.tag.id} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' }}>
                      {rel.tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Center Content */}
          <article className={styles.mainContent}>
            <div 
              className={styles.markdownContent} 
              dangerouslySetInnerHTML={{ __html: parsedContent }} 
            />

            {/* Author Box at the bottom */}
            {blog.author && (
              <div className={styles.authorBoxWrapper}>
                <div className={styles.authorBox}>
                  <h4>About the Author</h4>
                  {blog.author.image_url ? (
                    <img src={blog.author.image_url} alt={blog.author.name} className={styles.authorImageLg} style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#64748b', fontWeight: 'bold' }}>
                      {blog.author.name.charAt(0)}
                    </div>
                  )}
                  <div className={styles.authorDetails}>
                    <p className={styles.authorDetailsName}>{blog.author.name}</p>
                    <p className={styles.authorDetailsTitle}>{blog.author.designation}</p>
                    <p className={styles.authorDetailsBio}>{blog.author.short_bio || blog.author.long_bio}</p>
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Right Promo Sidebar - Dynamic Ads */}
          <aside className={styles.promoSidebar}>
            {ads.filter(ad => ad.position === 'sidebar').map(ad => (
              <div key={ad.id} className={styles.promoBanner} style={{ marginBottom: '20px' }}>
                {ad.image_url && <img src={ad.image_url} alt={ad.title} style={{ width: '100%', borderRadius: '8px 8px 0 0', marginBottom: '16px' }} />}
                <h3 className={styles.promoTitle}>
                  {ad.title}
                </h3>
                {ad.description && <p style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '16px', lineHeight: '1.5' }}>{ad.description}</p>}
                {ad.cta_url && (
                  <a href={ad.cta_url} target="_blank" rel="noopener noreferrer" className={styles.promoButton}>
                    {ad.cta_text || 'Learn More'}
                  </a>
                )}
              </div>
            ))}
            
            {/* Fallback hardcoded ad if no dynamic sidebar ads exist */}
            {ads.filter(ad => ad.position === 'sidebar').length === 0 && (
               <div className={styles.promoBanner}>
                <h3 className={styles.promoTitle}>
                  <span>Executive Post Graduate Certification in</span>
                  Data Science & AI
                </h3>
                <ul className={styles.promoList}>
                  <li>Learn from Industry Experts</li>
                  <li>Campus Immersion & Live Sessions</li>
                  <li>Top Tier Mentorship & Projects</li>
                </ul>
                <a href="#" className={styles.promoButton}>Enroll Now</a>
              </div>
            )}
          </aside>

        </div>
      </main>

      <div style={{ background: '#f8fafc', padding: '40px 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: '#111827' }}>Recommended Articles</h2>
        <BlogSlider />
      </div>

      <CareerCTASection />
    </div>
  );
}
