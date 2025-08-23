import { useEffect } from 'react';

export function SecurityHeaders() {
  useEffect(() => {
    // Set security headers via meta tags where possible
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Generate nonce for script security
    const nonce = crypto.getRandomValues(new Uint8Array(16))
      .reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '');
    
    // Enhanced Content Security Policy with nonce-based security
    setMetaTag('Content-Security-Policy', 
      "default-src 'self'; " +
      `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net https://js.stripe.com; ` +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://*.supabase.co https://*.supabase.com wss://*.supabase.co https://api.stripe.com; " +
      "font-src 'self' data: https://fonts.gstatic.com; " +
      "frame-ancestors 'none'; " +
      "form-action 'self'; " +
      "base-uri 'self'; " +
      "object-src 'none'; " +
      "upgrade-insecure-requests;"
    );

    // X-Frame-Options
    setMetaTag('X-Frame-Options', 'DENY');

    // X-Content-Type-Options
    setMetaTag('X-Content-Type-Options', 'nosniff');

    // Referrer Policy
    setMetaTag('referrer', 'strict-origin-when-cross-origin');

    // Additional security headers
    setMetaTag('X-XSS-Protection', '1; mode=block');
    setMetaTag('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    setMetaTag('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    
    // Prevent MIME type sniffing
    setMetaTag('X-Download-Options', 'noopen');
  }, []);

  return null;
}