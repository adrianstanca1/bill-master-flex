import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PasswordStrength {
  score: number;
  maxScore: number;
  isStrong: boolean;
  feedback: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very_strong';
}

export function usePasswordSecurity() {
  const [isValidating, setIsValidating] = useState(false);

  const validatePasswordStrength = useCallback(async (password: string): Promise<PasswordStrength | null> => {
    if (!password) return null;

    setIsValidating(true);
    try {
      const { data, error } = await supabase.rpc('validate_password_strength', {
        password: password
      });

      if (error) {
        console.error('Password validation error:', error);
        return null;
      }

      return data as unknown as PasswordStrength;
    } catch (error) {
      console.error('Password validation failed:', error);
      return null;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const getPasswordStrengthColor = useCallback((strength: string) => {
    switch (strength) {
      case 'very_strong':
        return 'text-green-600';
      case 'strong':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'weak':
      default:
        return 'text-red-500';
    }
  }, []);

  const getPasswordStrengthWidth = useCallback((score: number, maxScore: number) => {
    return `${Math.min((score / maxScore) * 100, 100)}%`;
  }, []);

  return {
    validatePasswordStrength,
    getPasswordStrengthColor,
    getPasswordStrengthWidth,
    isValidating
  };
}