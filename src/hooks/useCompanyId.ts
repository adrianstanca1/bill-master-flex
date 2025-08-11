
import { useState, useEffect } from 'react';

export function useCompanyId() {
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    // Try to get from settings first
    const settings = JSON.parse(localStorage.getItem('as-settings') || '{}');
    if (settings?.companyId) {
      setCompanyId(settings.companyId);
      return;
    }

    // If no company ID in settings, try to create one or get from user profile
    // For now, generate a default one for demo purposes
    const defaultCompanyId = 'demo-company-' + Date.now();
    const newSettings = { ...settings, companyId: defaultCompanyId };
    localStorage.setItem('as-settings', JSON.stringify(newSettings));
    setCompanyId(defaultCompanyId);
  }, []);

  return companyId;
}
