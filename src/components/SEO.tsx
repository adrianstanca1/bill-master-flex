import React, { useEffect } from "react";

type SEOProps = {
  title: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any> | Array<any>;
};

function upsertMeta(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

const SEO: React.FC<SEOProps> = ({ title, description, canonical, noindex, jsonLd }) => {
  useEffect(() => {
    // Title
    document.title = title.slice(0, 60);

    // Meta description
    if (description) {
      upsertMeta("description", description.slice(0, 160));
    }

    // Robots
    upsertMeta("robots", noindex ? "noindex, nofollow" : "index, follow");

    // Canonical
    const href = canonical || window.location.href;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = href;

    // Structured data
    const id = "seo-jsonld";
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, noindex, JSON.stringify(jsonLd)]);

  return null;
};

export default SEO;
