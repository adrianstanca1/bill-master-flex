import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OAuthProviderConfig {
  google: boolean;
  github: boolean;
  azure: boolean;
  custom: boolean;
}

export function useOAuthProviders() {
  const [enabledProviders, setEnabledProviders] = useState<OAuthProviderConfig>({
    google: false,
    github: false,
    azure: false,
    custom: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProviders = async () => {
      try {
        // Check if OAuth providers are enabled by calling the validation function
        const { data, error } = await supabase.rpc('validate_oauth_providers');
        
        if (data) {
          // Type the response data properly
          const providerData = data as { google_enabled?: boolean; microsoft_enabled?: boolean; custom_enabled?: boolean };
          setEnabledProviders({
            google: providerData.google_enabled || false,
            github: false,
            azure: providerData.microsoft_enabled || false,
            custom: providerData.custom_enabled || false
          });
        } else {
          // Default to all disabled if validation fails
          setEnabledProviders({
            google: false,
            github: false,
            azure: false,
            custom: false
          });
        }
      } catch (error) {
        console.warn('Failed to check OAuth providers:', error);
        // Default to all disabled on error
        setEnabledProviders({
          google: false,
          github: false,
          azure: false,
          custom: false
        });
      } finally {
        setLoading(false);
      }
    };

    checkProviders();
  }, []);

  const isProviderEnabled = (provider: keyof OAuthProviderConfig): boolean => {
    return enabledProviders[provider];
  };

  return {
    enabledProviders,
    isProviderEnabled,
    loading
  };
}