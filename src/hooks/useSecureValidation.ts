import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityValidationResult {
  isValid: boolean;
  violations: string[];
  companyId: string | null;
  userId: string | null;
}

export function useSecureValidation() {
  const [validationResult, setValidationResult] = useState<SecurityValidationResult>({
    isValid: true,
    violations: [],
    companyId: null,
    userId: null
  });
  const { toast } = useToast();

  const validateSecurityContext = async () => {
    try {
      // Call server-side validation function
      const { data, error } = await supabase.rpc('validate_security_context');
      
      if (error) {
        console.error('Security validation error:', error);
        setValidationResult({
          isValid: false,
          violations: ['Security validation failed'],
          companyId: null,
          userId: null
        });
        return;
      }

      if (!data) {
        // Get user info for detailed violation reporting
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user?.id)
          .single();

        const violations = [];
        if (!user) {
          violations.push('User not authenticated');
        } else if (!profile?.company_id) {
          violations.push('User has no company association - security isolation compromised');
        }

        setValidationResult({
          isValid: false,
          violations,
          companyId: profile?.company_id || null,
          userId: user?.id || null
        });

        if (violations.length > 0) {
          toast({
            title: "Security Issue Detected",
            description: "Please review and resolve security violations",
            variant: "destructive",
          });
        }
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user?.id)
          .single();

        setValidationResult({
          isValid: true,
          violations: [],
          companyId: profile?.company_id || null,
          userId: user?.id || null
        });
      }
    } catch (error) {
      console.error('Security validation error:', error);
      setValidationResult({
        isValid: false,
        violations: ['Security validation failed'],
        companyId: null,
        userId: null
      });
    }
  };

  useEffect(() => {
    validateSecurityContext();
    
    // Re-validate every 5 minutes
    const interval = setInterval(validateSecurityContext, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return validationResult;
}