import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

export function useRateLimiting(action: string, config: RateLimitConfig) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockExpiresAt, setBlockExpiresAt] = useState<Date | null>(null);
  const { toast } = useToast();

  const checkRateLimit = useCallback((): boolean => {
    const key = `rate_limit_${action}`;
    const now = Date.now();
    
    // Check if currently blocked
    const blockData = localStorage.getItem(`${key}_block`);
    if (blockData) {
      const blockInfo = JSON.parse(blockData);
      if (now < blockInfo.expiresAt) {
        setIsBlocked(true);
        setBlockExpiresAt(new Date(blockInfo.expiresAt));
        toast({
          title: "Rate limit exceeded",
          description: `Please wait before trying again. Block expires at ${new Date(blockInfo.expiresAt).toLocaleTimeString()}`,
          variant: "destructive"
        });
        return false;
      } else {
        // Block expired, clear it
        localStorage.removeItem(`${key}_block`);
        localStorage.removeItem(`${key}_attempts`);
        setIsBlocked(false);
        setBlockExpiresAt(null);
      }
    }

    // Check attempt count within window
    const attemptsData = localStorage.getItem(`${key}_attempts`);
    let attempts = attemptsData ? JSON.parse(attemptsData) : [];
    
    // Filter attempts within current window
    const windowStart = now - config.windowMs;
    attempts = attempts.filter((timestamp: number) => timestamp > windowStart);
    
    if (attempts.length >= config.maxAttempts) {
      // Block user
      const expiresAt = now + config.blockDurationMs;
      localStorage.setItem(`${key}_block`, JSON.stringify({ expiresAt }));
      setIsBlocked(true);
      setBlockExpiresAt(new Date(expiresAt));
      
      toast({
        title: "Rate limit exceeded",
        description: `Too many attempts. Please wait ${Math.ceil(config.blockDurationMs / 60000)} minutes before trying again.`,
        variant: "destructive"
      });
      return false;
    }

    // Record this attempt
    attempts.push(now);
    localStorage.setItem(`${key}_attempts`, JSON.stringify(attempts));
    
    return true;
  }, [action, config, toast]);

  const resetRateLimit = useCallback(() => {
    const key = `rate_limit_${action}`;
    localStorage.removeItem(`${key}_block`);
    localStorage.removeItem(`${key}_attempts`);
    setIsBlocked(false);
    setBlockExpiresAt(null);
  }, [action]);

  return {
    isBlocked,
    blockExpiresAt,
    checkRateLimit,
    resetRateLimit
  };
}