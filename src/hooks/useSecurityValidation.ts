
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityValidationResult {
  isValid: boolean;
  violations: string[];
  companyId: string | null;
  userId: string | null;
}

export function useSecurityValidation() {
  const [validationResult, setValidationResult] = useState<SecurityValidationResult>({
    isValid: false,
    violations: [],
    companyId: null,
    userId: null
  });
  const { toast } = useToast();

  useEffect(() => {
    const validateSecurity = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setValidationResult({
            isValid: false,
            violations: ['User not authenticated'],
            companyId: null,
            userId: null
          });
          return;
        }

        // Check user profile and company association
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, company_id, role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Security validation error:', error);
          setValidationResult({
            isValid: false,
            violations: ['Failed to validate user profile'],
            companyId: null,
            userId: user.id
          });
          return;
        }

        const violations: string[] = [];

        // Validate company association
        if (!profile.company_id) {
          violations.push('User has no company association - security isolation compromised');
          
          // Log security violation
          await supabase.rpc('log_security_violation', {
            violation_type: 'MISSING_COMPANY_ASSOCIATION',
            details: { user_id: user.id }
          }).catch(console.error);
        }

        // Check for suspicious activity patterns
        const { data: recentActivity } = await supabase
          .from('security_audit_log')
          .select('action, created_at')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        if (recentActivity && recentActivity.length > 50) {
          violations.push('Unusual activity pattern detected');
        }

        setValidationResult({
          isValid: violations.length === 0,
          violations,
          companyId: profile.company_id,
          userId: user.id
        });

        // Show warning if violations found
        if (violations.length > 0) {
          toast({
            title: "Security Warning",
            description: `${violations.length} security issue(s) detected. Please contact support.`,
            variant: "destructive"
          });
        }

      } catch (error) {
        console.error('Security validation failed:', error);
        setValidationResult({
          isValid: false,
          violations: ['Security validation failed'],
          companyId: null,
          userId: null
        });
      }
    };

    validateSecurity();
    
    // Re-validate every 5 minutes
    const interval = setInterval(validateSecurity, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [toast]);

  return validationResult;
}
