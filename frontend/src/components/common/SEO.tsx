import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = "BuyBright — India's Trusted Dental Supply Platform";
const DEFAULT_DESCRIPTION =
  "Order authentic dental supplies, rotary endodontic files, composite materials, dental equipment, and consumables direct from authorized brand distributors across India.";
const DEFAULT_KEYWORDS =
  "dental supply india, dentalproducts, superendo rotary files, composite restorative, 3m ESPE composite, dental equipment, dental instruments, b2b dental procurement";
const DEFAULT_OG_IMAGE = "https://buybright.com/images/banner.webp";
const BASE_URL = "https://buybright.com";

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title
      ? `${title} | BuyBright`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to update or create meta tags
    const updateMeta = (nameAttr: string, nameVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${nameVal}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, nameVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // 2. Standard Meta Tags
    updateMeta('name', 'description', description);
    updateMeta('name', 'keywords', keywords);

    // 3. Open Graph Tags
    updateMeta('property', 'og:title', formattedTitle);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`);
    updateMeta('property', 'og:type', ogType);
    const pageUrl = canonicalUrl ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${BASE_URL}${canonicalUrl}`) : window.location.href;
    updateMeta('property', 'og:url', pageUrl);

    // 4. Twitter Tags
    updateMeta('name', 'twitter:title', formattedTitle);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', pageUrl);

    // 6. Structured Data (JSON-LD)
    let jsonLdScript = document.getElementById('dynamic-jsonld') as HTMLScriptElement;
    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'dynamic-jsonld';
        jsonLdScript.type = 'application/ld+json';
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, jsonLd]);

  return null;
};
