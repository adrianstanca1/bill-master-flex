import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseStats {
  projects: number;
  clients: number;
}

async function fetchStats(): Promise<SupabaseStats> {
  const [projectRes, clientRes] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
  ]);

  if (projectRes.error || clientRes.error) {
    throw new Error(
      projectRes.error?.message || clientRes.error?.message || 'Failed to load stats',
    );
  }

  return {
    projects: projectRes.count ?? 0,
    clients: clientRes.count ?? 0,
  };
}

export function useSupabaseStats() {
  return useQuery({
    queryKey: ['supabase-stats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

