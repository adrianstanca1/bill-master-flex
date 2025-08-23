import React, { useEffect, useState } from 'react';
import { usePasswordSecurity } from '@/hooks/usePasswordSecurity';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  onStrengthChange?: (isStrong: boolean) => void;
}

export function PasswordStrengthIndicator({ 
  password, 
  onStrengthChange 
}: PasswordStrengthIndicatorProps) {
  const { validatePasswordStrength, getPasswordStrengthColor, isValidating } = usePasswordSecurity();
  const [strength, setStrength] = useState<any>(null);

  useEffect(() => {
    if (!password) {
      setStrength(null);
      onStrengthChange?.(false);
      return;
    }

    const validatePassword = async () => {
      const result = await validatePasswordStrength(password);
      setStrength(result);
      onStrengthChange?.(result?.isStrong || false);
    };

    const debounceTimer = setTimeout(validatePassword, 500);
    return () => clearTimeout(debounceTimer);
  }, [password, validatePasswordStrength, onStrengthChange]);

  if (!password || !strength) return null;

  const getStrengthIcon = () => {
    switch (strength.strength) {
      case 'very_strong':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'strong':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'weak':
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStrengthLabel = () => {
    switch (strength.strength) {
      case 'very_strong':
        return 'Very Strong';
      case 'strong':
        return 'Strong';
      case 'medium':
        return 'Medium';
      case 'weak':
      default:
        return 'Weak';
    }
  };

  return (
    <Card className="mt-2">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          {getStrengthIcon()}
          <span className={`text-sm font-medium ${getPasswordStrengthColor(strength.strength)}`}>
            Password Strength: {getStrengthLabel()}
          </span>
        </div>
        
        <Progress 
          value={(strength.score / strength.maxScore) * 100} 
          className="h-2"
        />
        
        {strength.feedback && strength.feedback.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Suggestions:</p>
            <ul className="text-xs space-y-1">
              {strength.feedback.map((suggestion: string, index: number) => (
                <li key={index} className="text-muted-foreground flex items-start gap-1">
                  <span className="text-red-400 mt-0.5">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {isValidating && (
          <p className="text-xs text-muted-foreground">Validating password...</p>
        )}
      </CardContent>
    </Card>
  );
}