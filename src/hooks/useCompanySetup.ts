import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface CompanySetupData {
  companyName: string;
  country?: string;
  industry?: string;
}

export function useCompanySetup() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const setupCompany = async (data: CompanySetupData) => {
    setLoading(true);
    
    try {
      const { data: result, error } = await supabase.rpc('setup_user_company', {
        company_name: data.companyName,
        company_country: data.country || 'UK',
        company_industry: data.industry || 'construction'
      });

      if (error) {
        throw error;
      }

      // Mark as onboarded in localStorage
      const settings = {
        onboarded: true,
        companyName: data.companyName,
        country: data.country || 'UK',
        industry: data.industry || 'construction'
      };
      localStorage.setItem('as-settings', JSON.stringify(settings));

      toast({
        title: "Setup Complete!",
        description: "Your company has been created successfully."
      });

      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
      
      return result;
    } catch (error: any) {
      console.error('Company setup error:', error);
      toast({
        title: "Setup Error",
        description: error?.message || "Failed to create company. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    setupCompany,
    loading
  };
}