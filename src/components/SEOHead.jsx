import React from 'react';
import { Helmet } from 'react-helmet-async';

const DOMAIN = 'https://www.learndepthacademy.com';

export default function SEOHead({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/logo.svg', // Will be absolute in usage
  twitterCard = 'summary_large_image',
  robots = 'index, follow',
  schema,
  breadcrumbs,
  author,
  publishedDate,
  modifiedDate,
}) {
  // Ensure we have a clean canonical URL without trailing slashes
  const cleanCanonical = canonicalUrl?.endsWith('/') && canonicalUrl !== DOMAIN + '/' 
    ? canonicalUrl.slice(0, -1) 
    : canonicalUrl;

  const finalOgImage = ogImage.startsWith('http') ? ogImage : `${DOMAIN}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      {/* Canonical URL */}
      {cleanCanonical && <link rel="canonical" href={cleanCanonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {cleanCanonical && <meta property="og:url" content={cleanCanonical} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content="LearnDepth Academy" />

      {/* Twitter / X */}
      <meta name="twitter:card" content={twitterCard} />
      {cleanCanonical && <meta name="twitter:url" content={cleanCanonical} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Article Specific Meta */}
      {ogType === 'article' && author && <meta property="article:author" content={author} />}
      {ogType === 'article' && publishedDate && <meta property="article:published_time" content={publishedDate} />}
      {ogType === 'article' && modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}

      {/* Structured Data (Schema.org) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* Breadcrumbs Schema */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.name,
              "item": crumb.url
            }))
          })}
        </script>
      )}
    </Helmet>
  );
}
