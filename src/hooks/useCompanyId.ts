
import { useState, useEffect } from 'react';

export function useCompanyId() {
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('as-settings') || '{}');
    setCompanyId(settings?.companyId || null);
  }, []);

  return companyId;
}
