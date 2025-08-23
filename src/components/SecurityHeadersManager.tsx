import { useEffect } from 'react';

export function SecurityHeadersManager() {
  useEffect(() => {
    // Remove client-side CSP headers since they're now handled by Vite
    const existingCSP = document.querySelector('meta[name="Content-Security-Policy"]');
    if (existingCSP) {
      existingCSP.remove();
    }

    // Add additional client-side security measures
    const setSecurityHeaders = () => {
      // Disable right-click context menu in production
      if (import.meta.env.PROD) {
        document.addEventListener('contextmenu', (e) => e.preventDefault());
      }

      // Detect if DevTools is open (production only)
      if (import.meta.env.PROD) {
        let devtools = { open: false };
        const element = new Image();
        
        setInterval(() => {
          const before = performance.now();
          console.profile();
          console.profileEnd();
          const after = performance.now();
          
          if (after - before > 100 && !devtools.open) {
            devtools.open = true;
            // Log to Supabase instead of non-existent API
            import('@/integrations/supabase/client').then(({ supabase }) => {
              supabase.from('security_audit_log').insert({
                action: 'DEVTOOLS_OPENED',
                resource_type: 'security_monitoring',
                details: {
                  timestamp: new Date().toISOString(),
                  userAgent: navigator.userAgent
                }
              });
            }).catch(() => {}); // Silent fail
          }
        }, 1000);
      }

      // Monitor for suspicious clipboard activity
      document.addEventListener('copy', (e) => {
        const selection = window.getSelection()?.toString() || '';
        if (selection.length > 100) {
          const sensitivePatterns = [
            /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Email
            /\b(?:password|token|key|secret)\b/gi, // Sensitive keywords
            /\b[A-Za-z0-9+/]{20,}={0,2}\b/g // Base64-like patterns
          ];

          const hasSensitiveData = sensitivePatterns.some(pattern => pattern.test(selection));
          
          if (hasSensitiveData) {
            // Log to Supabase instead of non-existent API
            import('@/integrations/supabase/client').then(({ supabase }) => {
              supabase.from('security_audit_log').insert({
                action: 'SENSITIVE_DATA_COPIED',
                resource_type: 'security_monitoring',
                details: {
                  dataLength: selection.length,
                  timestamp: new Date().toISOString()
                }
              });
            }).catch(() => {}); // Silent fail
          }
        }
      });
    };

    setSecurityHeaders();
  }, []);

  return null;
}