import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// We can read from .env if running locally, or Vercel provides these in CI
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xohibwghvohuvzihvtzf.supabase.co'; // Replace if needed
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 

const DOMAIN = 'https://www.learndepthacademy.com';

async function generateSitemap() {
  console.log('Generating sitemap...');
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  const addUrl = (url, priority = 0.8, changefreq = 'weekly') => {
    // Escape XML entities
    const escapedUrl = url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    sitemapContent += `  <url>
    <loc>${escapedUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
  };

  // 1. Static Routes
  addUrl(`${DOMAIN}/`, 1.0, 'daily');
  addUrl(`${DOMAIN}/about`, 0.8, 'monthly');
  addUrl(`${DOMAIN}/careers`, 0.9, 'weekly');
  addUrl(`${DOMAIN}/hire-from-us`, 0.8, 'monthly');
  
  // 2. Hardcoded Programs & Internships from data files
  const programs = ['data-science', 'machine-learning', 'generative-ai', 'full-stack-development', 'dsa', 'python'];
  programs.forEach(slug => addUrl(`${DOMAIN}/programs/${slug}`, 0.9, 'monthly'));

  const internships = ['machine-learning', 'data-science', 'python', 'web-development', 'app-development', 'ai', 'java', 'sales-marketing'];
  internships.forEach(slug => addUrl(`${DOMAIN}/internships/${slug}`, 0.9, 'monthly'));

  // 3. Dynamic Routes from Supabase
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
      // Fetch Jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('slug, updated_at')
        .eq('status', 'published')
        .eq('no_index', false);
        
      if (jobs) {
        jobs.forEach(job => {
          addUrl(`${DOMAIN}/careers/jobs/${job.slug}`, 0.8, 'daily');
        });
      }

      // Fetch Blogs (Assuming table is 'blogs' and status 'published')
      const { data: blogs } = await supabase
        .from('blogs')
        .select('slug, updated_at')
        .eq('status', 'published');
        
      if (blogs) {
        blogs.forEach(blog => {
          addUrl(`${DOMAIN}/blog/${blog.slug}`, 0.8, 'weekly');
        });
      }

    } catch (err) {
      console.error('Error fetching dynamic routes for sitemap:', err.message);
    }
  } else {
    console.warn('Supabase credentials not found. Dynamic routes skipped.');
  }

  sitemapContent += `</urlset>`;

  // Write to public/sitemap.xml
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
  console.log('sitemap.xml successfully generated at /public/sitemap.xml');

  // Also write robots.txt to ensure it exists and blocks /admin/
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*?*

User-agent: OAI-SearchBot
Allow: /
Disallow: /admin/

Sitemap: ${DOMAIN}/sitemap.xml
`;
  
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('robots.txt successfully generated at /public/robots.txt');
}

generateSitemap().catch(console.error);
