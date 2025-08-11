
import { useState, useEffect } from 'react';

export const useCompanyId = () => {
  const [companyId, setCompanyId] = useState<string>('');

  useEffect(() => {
    // Try to get company ID from localStorage settings
    try {
      const settings = JSON.parse(localStorage.getItem('as-settings') || '{}');
      if (settings.companyId) {
        setCompanyId(settings.companyId);
        return;
      }
    } catch (error) {
      console.error('Error parsing settings:', error);
    }

    // If no company ID found, generate a default one
    // This should be replaced with proper company selection/creation logic
    const defaultCompanyId = crypto.randomUUID();
    setCompanyId(defaultCompanyId);

    // Save it to localStorage for consistency
    try {
      const currentSettings = JSON.parse(localStorage.getItem('as-settings') || '{}');
      const updatedSettings = { ...currentSettings, companyId: defaultCompanyId };
      localStorage.setItem('as-settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving company ID:', error);
    }
  }, []);

  return companyId;
};
