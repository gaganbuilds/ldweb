const DOMAIN = 'https://www.learndepthacademy.com';

export const buildOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LearnDepth Academy LLP",
  "url": DOMAIN,
  "logo": `${DOMAIN}/logo.svg`,
  "email": "learndepthacademy@gmail.com",
  "telephone": "9980855683",
  "sameAs": [
    "https://codedepth.site"
  ]
});

export const buildLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "LearnDepth Academy LLP",
  "image": `${DOMAIN}/logo.svg`,
  "url": DOMAIN,
  "telephone": "9980855683",
  "email": "learndepthacademy@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "#527, 8th Main Road, Mahadeshwara Badavane Layout, Metagalli",
    "addressLocality": "Mysuru",
    "addressRegion": "Karnataka",
    "postalCode": "570016",
    "addressCountry": "IN"
  }
});

export const buildWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "LearnDepth Academy",
  "url": DOMAIN
});

export const buildArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `${DOMAIN}/blog/${article.slug}`
  },
  "headline": article.seo_title || article.title,
  "description": article.seo_description || article.excerpt,
  "image": article.og_image || `${DOMAIN}/logo.svg`,
  "author": {
    "@type": "Person",
    "name": article.author_name || "LearnDepth Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "LearnDepth Academy LLP",
    "logo": {
      "@type": "ImageObject",
      "url": `${DOMAIN}/logo.svg`
    }
  },
  "datePublished": article.published_at || article.created_at,
  "dateModified": article.updated_at
});

export const buildJobPostingSchema = (job) => {
  // Try to parse salary properly if available
  let baseSalary = undefined;
  if (job.salary_visible && job.salary_min) {
    baseSalary = {
      "@type": "MonetaryAmount",
      "currency": job.salary_currency || "INR",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": parseFloat(job.salary_min),
        "maxValue": job.salary_max ? parseFloat(job.salary_max) : parseFloat(job.salary_min),
        "unitText": job.salary_period ? job.salary_period.toUpperCase() : "YEAR"
      }
    };
  }

  // Format date correctly
  const datePosted = job.published_at || job.created_at || new Date().toISOString();
  // Valid through is typically required by Google, defaulting to 1 month from published if not provided
  const validThrough = job.application_deadline ? new Date(job.application_deadline).toISOString() : new Date(new Date(datePosted).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  // Employment Type mapping
  const empTypeMap = {
    'Full-time': 'FULL_TIME',
    'Part-time': 'PART_TIME',
    'Internship': 'INTERN',
    'Contract': 'CONTRACTOR',
    'Freelance': 'CONTRACTOR'
  };
  const empType = empTypeMap[job.employment_type] || 'FULL_TIME';

  // Remote vs office
  let jobLocationType = undefined;
  if (job.work_mode && job.work_mode.toLowerCase() === 'remote') {
    jobLocationType = 'TELECOMMUTE';
  }

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || job.short_description || job.title,
    "datePosted": datePosted,
    "validThrough": validThrough,
    "employmentType": empType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company_name || "LearnDepth Academy",
      "sameAs": DOMAIN,
      "logo": job.company_logo_url || `${DOMAIN}/logo.svg`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "Mysuru",
        "addressRegion": "Karnataka",
        "addressCountry": "IN"
      }
    },
    ...(jobLocationType ? { "jobLocationType": jobLocationType } : {}),
    ...(baseSalary ? { "baseSalary": baseSalary } : {})
  };
};

export const buildCourseSchema = (program) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": program.title,
  "description": program.description || program.shortDescription,
  "provider": {
    "@type": "Organization",
    "name": "LearnDepth Academy LLP",
    "sameAs": DOMAIN
  }
});
