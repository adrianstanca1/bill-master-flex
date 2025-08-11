
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import type { DashboardStats } from '@/types/business';

export function useDashboardStats() {
  const companyId = useCompanyId();

  return useQuery({
    queryKey: ['dashboard-stats', companyId],
    queryFn: async (): Promise<DashboardStats | null> => {
      if (!companyId) return null;
      
      try {
        const [
          { count: activeProjects },
          { count: pendingReminders },
          { count: activeTimesheets },
          { count: recentDayworks },
          { count: totalAssets },
          { count: recentPhotos },
          { count: ramsDocuments }
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }).eq('company_id', companyId),
          supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('company_id', companyId).eq('status', 'pending'),
          supabase.from('timesheets').select('*', { count: 'exact', head: true }).eq('company_id', companyId).eq('status', 'active'),
          supabase.from('dayworks').select('*', { count: 'exact', head: true }).eq('company_id', companyId).gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
          supabase.from('asset_tracking').select('*', { count: 'exact', head: true }).eq('company_id', companyId),
          supabase.from('site_photos').select('*', { count: 'exact', head: true }).eq('company_id', companyId).gte('photo_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
          supabase.from('rams_documents').select('*', { count: 'exact', head: true }).eq('company_id', companyId)
        ]);

        return {
          activeProjects: activeProjects || 0,
          pendingReminders: pendingReminders || 0,
          activeTimesheets: activeTimesheets || 0,
          recentDayworks: recentDayworks || 0,
          totalAssets: totalAssets || 0,
          recentPhotos: recentPhotos || 0,
          ramsDocuments: ramsDocuments || 0,
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },
    enabled: !!companyId,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}
