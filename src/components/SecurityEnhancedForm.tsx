import React, { ReactNode, useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSecureLogging } from '@/hooks/useSecureLogging';

interface SecurityEnhancedFormProps {
  onSubmit: (data: any) => void;
  children: ReactNode;
  className?: string;
  requireCsrf?: boolean;
  rateLimit?: {
    maxAttempts: number;
    timeWindow: number; // in minutes
  };
}

export function SecurityEnhancedForm({ 
  onSubmit, 
  children, 
  className, 
  requireCsrf = false,
  rateLimit
}: SecurityEnhancedFormProps) {
  const { toast } = useToast();
  const { logSecurityEvent, logSuspiciousActivity } = useSecureLogging();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (requireCsrf) {
      // Generate CSRF token
      const token = crypto.randomUUID() + crypto.randomUUID();
      setCsrfToken(token);
      sessionStorage.setItem('csrf_token', token);
    }
  }, [requireCsrf]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // CSRF validation
      if (requireCsrf) {
        const storedToken = sessionStorage.getItem('csrf_token');
        if (!storedToken || storedToken !== csrfToken) {
          toast({
            title: "Security Error",
            description: "Invalid CSRF token. Please refresh and try again.",
            variant: "destructive",
          });
          return;
        }
      }

      // Enhanced rate limiting check
      if (rateLimit) {
        const identifier = `${window.location.href}_${navigator.userAgent.slice(0, 50)}`;
        const { data: rateLimitResult } = await supabase.rpc('enhanced_rate_limit_check', {
          identifier: identifier,
          action_type: 'form_submission',
          max_attempts: rateLimit.maxAttempts,
          time_window: `${rateLimit.timeWindow} minutes`,
          block_duration: '1 hour'
        });

        const rateLimitData = rateLimitResult as any;
        if (!rateLimitData?.allowed) {
          const blockTime = rateLimitData?.block_expires_at 
            ? new Date(rateLimitData.block_expires_at).toLocaleTimeString()
            : 'temporarily';
          
          await logSuspiciousActivity('RATE_LIMIT_EXCEEDED', {
            identifier,
            attempts_made: rateLimitData?.attempts_remaining || 0,
            block_expires_at: rateLimitData?.block_expires_at
          });

          toast({
            title: "Too Many Attempts",
            description: `Please wait until ${blockTime} before submitting again.`,
            variant: "destructive",
            duration: 10000,
          });
          return;
        }
      }

      const formData = new FormData(e.currentTarget);
      const data: { [key: string]: string } = {};
      
      // Add CSRF token to data if required
      if (requireCsrf) {
        data._csrf = csrfToken;
      }
      
      // Enhanced server-side input sanitization with threat detection
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          // First, client-side sanitization
          const clientSanitized = DOMPurify.sanitize(value, { 
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
            FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'style'],
            FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus']
          }).trim();
          
          // Enhanced server-side sanitization with threat detection
          try {
            const { data: sanitizationResult } = await supabase.rpc('sanitize_input_enhanced', {
              input_text: clientSanitized
            });
            
            if (sanitizationResult) {
              const sanitizationData = sanitizationResult as any;
              data[key] = sanitizationData.sanitized_text || clientSanitized;
              
              // Handle high-threat inputs
              if (sanitizationData.threat_level >= 4) {
                await logSuspiciousActivity('HIGH_THREAT_INPUT', {
                  field: key,
                  threat_level: sanitizationData.threat_level,
                  threats_detected: sanitizationData.threats_detected,
                  original_length: value.length,
                  sanitized_length: sanitizationData.sanitized_text?.length || 0
                });

                toast({
                  title: "Security Warning",
                  description: "Potentially malicious content detected and blocked.",
                  variant: "destructive",
                  duration: 8000,
                });
                return;
              }
              
              // Log medium-threat inputs
              if (sanitizationData.threat_level >= 2) {
                await logSecurityEvent({
                  eventType: 'MEDIUM_THREAT_INPUT',
                  severity: 'medium',
                  details: {
                    field: key,
                    threat_level: sanitizationData.threat_level,
                    threats_detected: sanitizationData.threats_detected
                  },
                  resourceType: 'form_security'
                });
              }
            } else {
              data[key] = clientSanitized; // Fallback
            }
          } catch (error) {
            console.error('Failed to sanitize input:', error);
            data[key] = clientSanitized; // Fallback to client sanitization
          }
        }
      }
      
      onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {requireCsrf && (
        <input type="hidden" name="_csrf" value={csrfToken} />
      )}
      {children}
    </form>
  );
}