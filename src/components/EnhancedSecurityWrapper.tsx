import { useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SecurityHeaders } from './SecurityHeaders';
import { SecurityMiddleware } from './SecurityMiddleware';

interface EnhancedSecurityWrapperProps {
  children: ReactNode;
}

export function EnhancedSecurityWrapper({ children }: EnhancedSecurityWrapperProps) {
  const { toast } = useToast();

  useEffect(() => {
    // Enhanced Content Security Policy
    const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!metaCSP) {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.supabase.co",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.supabase.co https://*.supabase.com wss://*.supabase.co https://api.ipify.org",
        "font-src 'self' data: https://fonts.gstatic.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ');
      document.head.appendChild(meta);
    }

    // Monitor for DevTools usage in production
    if (process.env.NODE_ENV === 'production') {
      const devtools = {
        open: false,
        orientation: null as string | null
      };

      const threshold = 160;

      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            // Log DevTools opening
            supabase.from('security_audit_log').insert({
              action: 'DEVTOOLS_OPENED',
              resource_type: 'browser_security',
              details: {
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`,
                window_size: `${window.innerWidth}x${window.innerHeight}`
              }
            });
          }
        } else {
          devtools.open = false;
        }
      }, 500);
    }

    // Monitor for suspicious mouse/keyboard patterns
    let rapidClicks = 0;
    let lastClickTime = 0;

    const handleClick = () => {
      const now = Date.now();
      if (now - lastClickTime < 100) { // Clicks faster than 100ms apart
        rapidClicks++;
        if (rapidClicks > 10) {
          supabase.from('security_audit_log').insert({
            action: 'SUSPICIOUS_CLICK_PATTERN',
            resource_type: 'user_behavior',
            details: {
              rapid_clicks: rapidClicks,
              timestamp: new Date().toISOString()
            }
          });
          rapidClicks = 0; // Reset counter
        }
      } else {
        rapidClicks = 0;
      }
      lastClickTime = now;
    };

    // Monitor for copy/paste of sensitive data
    const handleCopy = (event: ClipboardEvent) => {
      const selection = window.getSelection()?.toString() || '';
      if (selection.length > 100 && (
        selection.includes('@') || 
        selection.includes('password') || 
        selection.includes('token')
      )) {
        supabase.from('security_audit_log').insert({
          action: 'SENSITIVE_DATA_COPIED',
          resource_type: 'data_security',
          details: {
            content_length: selection.length,
            contains_email: selection.includes('@'),
            timestamp: new Date().toISOString()
          }
        });
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  return (
    <>
      <SecurityHeaders />
      <SecurityMiddleware />
      {children}
    </>
  );
}