
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  details?: any;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalAlerts: number;
  failedLogins: number;
  privilegeEscalationAttempts: number;
  unauthorizedAccessAttempts: number;
}

export function useEnhancedSecurity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user's role and company info
  const { data: profile } = useQuery({
    queryKey: ['security-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, company_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  // Monitor security audit logs for suspicious activity
  const { data: securityMetrics } = useQuery({
    queryKey: ['security-metrics', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return null;

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('company_id', profile.company_id)
        .gte('created_at', oneHourAgo)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Analyze the audit logs for security metrics
      const metrics: SecurityMetrics = {
        totalEvents: data.length,
        criticalAlerts: 0,
        failedLogins: 0,
        privilegeEscalationAttempts: 0,
        unauthorizedAccessAttempts: 0
      };

      data.forEach(log => {
        if (log.action === 'FAILED_LOGIN') {
          metrics.failedLogins++;
        }
        if (log.action === 'PRIVILEGE_ESCALATION_ATTEMPT') {
          metrics.privilegeEscalationAttempts++;
          metrics.criticalAlerts++;
        }
        if (log.action === 'UNAUTHORIZED_ACCESS') {
          metrics.unauthorizedAccessAttempts++;
        }
      });

      return metrics;
    },
    enabled: !!profile?.company_id && profile?.role === 'admin',
    refetchInterval: 60000, // Check every minute
  });

  // Get recent security alerts
  const { data: recentAlerts } = useQuery({
    queryKey: ['security-alerts', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('company_id', profile.company_id)
        .in('action', ['FAILED_LOGIN', 'PRIVILEGE_ESCALATION_ATTEMPT', 'UNAUTHORIZED_ACCESS'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data.map(log => ({
        id: log.id,
        type: log.action === 'PRIVILEGE_ESCALATION_ATTEMPT' ? 'critical' : 'high',
        message: `Security event: ${log.action} by user ${log.user_id}`,
        timestamp: log.created_at,
        details: log.details
      })) as SecurityAlert[];
    },
    enabled: !!profile?.company_id && profile?.role === 'admin',
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Test RLS policies function
  const testSecurityPolicies = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('test_rls_policies');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const failedTests = data.filter((test: any) => !test.result);
      if (failedTests.length > 0) {
        toast({
          title: "Security Policy Issues Detected",
          description: `${failedTests.length} security policies are not working correctly.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Security Policies Verified",
          description: "All security policies are functioning correctly.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Security Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Log security event
  const logSecurityEvent = useMutation({
    mutationFn: async ({ action, resourceType, resourceId, details }: {
      action: string;
      resourceType: string;
      resourceId?: string;
      details?: any;
    }) => {
      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details || {}
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['security-alerts'] });
    }
  });

  return {
    profile,
    securityMetrics,
    recentAlerts,
    testSecurityPolicies,
    logSecurityEvent,
    isAdmin: profile?.role === 'admin',
    isMonitoring: !!profile?.company_id && profile?.role === 'admin'
  };
}
