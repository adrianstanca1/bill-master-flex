import React, { ReactNode, useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

      // Rate limiting check
      if (rateLimit) {
        const { data: rateLimitCheck } = await supabase.rpc('check_rate_limit', {
          user_identifier: crypto.randomUUID(), // Use session ID or user ID
          action_type: 'FORM_SUBMISSION',
          max_attempts: rateLimit.maxAttempts,
          time_window: `${rateLimit.timeWindow} minutes`
        });

        if (!rateLimitCheck) {
          toast({
            title: "Rate Limit Exceeded",
            description: `Too many attempts. Please wait ${rateLimit.timeWindow} minutes.`,
            variant: "destructive",
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
      
      // Sanitize all form inputs with enhanced security
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        // Enhanced sanitization - remove all HTML and scripts
        data[key] = DOMPurify.sanitize(value, { 
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          FORBID_TAGS: ['script', 'object', 'embed', 'iframe'],
          FORBID_ATTR: ['onerror', 'onload', 'onclick']
        }).trim();
        
        // Additional validation - check for suspicious patterns
        if (data[key].includes('<script') || data[key].includes('javascript:') || data[key].includes('data:')) {
          console.warn('Suspicious input detected and sanitized:', key);
          
          // Log security event
          try {
            await supabase.from('security_audit_log').insert({
              action: 'SUSPICIOUS_INPUT_DETECTED',
              resource_type: 'form_submission',
              details: {
                field: key,
                original_length: value.length,
                sanitized_length: data[key].length,
                timestamp: new Date().toISOString()
              }
            });
          } catch (error) {
            console.error('Failed to log security event:', error);
          }
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