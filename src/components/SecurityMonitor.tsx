
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock } from 'lucide-react';
import { useCompanyId } from '@/hooks/useCompanyId';

interface AuditLogEntry {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: any;
  created_at: string;
  user_id: string;
}

export function SecurityMonitor() {
  const companyId = useCompanyId();

  const { data: auditLogs, isLoading: auditLoading } = useQuery({
    queryKey: ['security-audit-logs', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as AuditLogEntry[];
    },
    enabled: !!companyId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: rlsTestResults } = useQuery({
    queryKey: ['rls-test-results'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('test_rls_policies');
      if (error) throw error;
      return data;
    },
    refetchInterval: 300000, // Test every 5 minutes
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'INSERT': return 'bg-green-500';
      case 'UPDATE': return 'bg-blue-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (auditLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
        <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* RLS Policy Test Results */}
      {rlsTestResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Policy Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rlsTestResults.map((test: any, index: number) => (
                <Alert key={index} className={test.result ? "border-green-500" : "border-red-500"}>
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>{test.table_name}: {test.policy_test}</span>
                      <Badge className={test.result ? "bg-green-500" : "bg-red-500"}>
                        {test.result ? "PASS" : "FAIL"}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs?.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge className={getActionBadgeColor(log.action)}>
                    {log.action}
                  </Badge>
                  <div>
                    <p className="font-medium">{log.resource_type}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {log.resource_id?.slice(0, 8)}...
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                  {log.details?.old_total !== undefined && log.details?.new_total !== undefined && (
                    <p className="text-sm">
                      £{log.details.old_total} → £{log.details.new_total}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {(!auditLogs || auditLogs.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No security events recorded yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Enable two-factor authentication for all admin accounts
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Review and rotate API keys regularly (recommended: every 90 days)
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
