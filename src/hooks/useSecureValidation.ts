import { useEffect, useState, useCallback } from 'react';
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

  const validateSecurityContext = useCallback(async () => {
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
          .eq('id', user?.id || '')
          .maybeSingle();

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
          .eq('id', user?.id || '')
          .maybeSingle();

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
  }, [toast]);

  useEffect(() => {
    // Only validate security context for authenticated users
    const checkAndValidate = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        validateSecurityContext();
      } else {
        // Set default state for unauthenticated users
        setValidationResult({
          isValid: true, // Don't show security alerts on auth page
          violations: [],
          companyId: null,
          userId: null
        });
      }
    };

    checkAndValidate();

    // Re-validate every 5 minutes only if user is authenticated
    const interval = setInterval(checkAndValidate, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [validateSecurityContext]);

  return validationResult;
}