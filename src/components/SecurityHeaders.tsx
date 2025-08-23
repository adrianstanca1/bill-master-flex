import { useEffect } from 'react';
import { SecurityHeadersManager } from './SecurityHeadersManager';

export function SecurityHeaders() {
  useEffect(() => {
    // Set basic security meta tags only - avoid CSP conflicts
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic security headers for fallback (not CSP)
    setMetaTag('referrer', 'strict-origin-when-cross-origin');
    setMetaTag('X-Download-Options', 'noopen');
    setMetaTag('X-Content-Type-Options', 'nosniff');
    setMetaTag('X-Frame-Options', 'DENY');
  }, []);

  return <SecurityHeadersManager />;
}