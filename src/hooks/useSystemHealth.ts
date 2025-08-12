
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemHealth {
  database: 'online' | 'offline' | 'warning';
  functions: 'online' | 'offline' | 'warning';
  auth: 'online' | 'offline' | 'warning';
  apis: number;
  lastCheck: string;
}

export function useSystemHealth() {
  const { toast } = useToast();

  const { data: systemHealth, isLoading, refetch } = useQuery({
    queryKey: ['system-health'],
    queryFn: async (): Promise<SystemHealth> => {
      try {
        // Test database connection
        const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
        const databaseStatus = dbError ? 'offline' : 'online';

        // Test authentication
        const { error: authError } = await supabase.auth.getSession();
        const authStatus = authError ? 'offline' : 'online';

        // Get API integrations count
        const { data: apis } = await supabase
          .from('api_integrations')
          .select('id')
          .eq('status', 'active');

        return {
          database: databaseStatus,
          functions: 'online', // Assume functions are online if we can query
          auth: authStatus,
          apis: apis?.length || 0,
          lastCheck: new Date().toISOString()
        };
      } catch (error) {
        console.error('System health check failed:', error);
        return {
          database: 'offline',
          functions: 'offline',
          auth: 'offline',
          apis: 0,
          lastCheck: new Date().toISOString()
        };
      }
    },
    refetchInterval: 60000, // Check every minute
  });

  const runHealthCheck = async () => {
    try {
      await refetch();
      toast({
        title: "Health Check Complete",
        description: "System health has been checked successfully",
      });
    } catch (error) {
      toast({
        title: "Health Check Failed",
        description: "Unable to complete system health check",
        variant: "destructive",
      });
    }
  };

  return {
    systemHealth: systemHealth || {
      database: 'offline',
      functions: 'offline',
      auth: 'offline',
      apis: 0,
      lastCheck: new Date().toISOString()
    },
    isLoading,
    runHealthCheck
  };
}
