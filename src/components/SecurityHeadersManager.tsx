import { useEffect } from 'react';

export function SecurityHeadersManager() {
  useEffect(() => {
    // Client-side security measures only - no CSP manipulation to prevent conflicts
    const setSecurityHeaders = () => {
      // Disable right-click context menu in production
      if (import.meta.env.PROD) {
        document.addEventListener('contextmenu', (e) => e.preventDefault());
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
            // Log to Supabase
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