import { useEffect } from 'react';
import { SecurityHeadersManager } from './SecurityHeadersManager';

export function SecurityHeaders() {
  useEffect(() => {
    // Legacy meta tag support for older browsers
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic security headers for fallback
    setMetaTag('referrer', 'strict-origin-when-cross-origin');
    setMetaTag('X-Download-Options', 'noopen');
  }, []);

  return <SecurityHeadersManager />;
}