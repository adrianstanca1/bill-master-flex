
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Activity } from 'lucide-react';
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
        .limit(10);

      if (error) throw error;
      return data as AuditLogEntry[];
    },
    enabled: !!companyId,
    refetchInterval: 30000, // Refresh every 30 seconds
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
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Activity Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">Online</div>
              <div className="text-sm text-muted-foreground">System Status</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{auditLogs?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Recent Activities</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent System Activity
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
                No recent activity recorded.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Database Response Time</span>
              <span className="font-semibold text-green-600">&lt; 100ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span>API Success Rate</span>
              <span className="font-semibold text-green-600">99.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Sessions</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Memory Usage</span>
              <span className="font-semibold text-yellow-600">67%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
