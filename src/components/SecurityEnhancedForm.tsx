import React, { ReactNode } from 'react';
import DOMPurify from 'dompurify';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEnhancedFormProps {
  onSubmit: (data: any) => void;
  children: ReactNode;
  className?: string;
}

export function SecurityEnhancedForm({ onSubmit, children, className }: SecurityEnhancedFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data: { [key: string]: string } = {};
    
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
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}