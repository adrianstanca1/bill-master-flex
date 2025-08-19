
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function SecurityMonitor() {
  const { toast } = useToast();

  // Monitor for security violations in real-time
  const { data: securityViolations } = useQuery({
    queryKey: ['security-violations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('action', 'SECURITY_VIOLATION')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Check company isolation integrity
  const { data: companyIsolationCheck } = useQuery({
    queryKey: ['company-isolation-check'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { status: 'unauthenticated', issues: [] };

      // Check if user has proper company association
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, company_id, role')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const issues = [];
      if (!profile.company_id) {
        issues.push('User has no company association');
      }

      return {
        status: issues.length === 0 ? 'secure' : 'vulnerable',
        issues,
        profile
      };
    },
    refetchInterval: 60000, // Check every minute
  });

  // Alert on security violations
  useEffect(() => {
    if (securityViolations && securityViolations.length > 0) {
      const recentViolations = securityViolations.filter(
        v => new Date(v.created_at) > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
      );

      if (recentViolations.length > 0) {
        toast({
          title: "Security Alert",
          description: `${recentViolations.length} security violation(s) detected`,
          variant: "destructive"
        });
      }
    }
  }, [securityViolations, toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Company Isolation Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium">Company Isolation</span>
            </div>
            <div className="flex items-center gap-2">
              {companyIsolationCheck?.status === 'secure' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : companyIsolationCheck?.status === 'vulnerable' ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
              <Badge 
                className={
                  companyIsolationCheck?.status === 'secure' ? 'bg-green-500' :
                  companyIsolationCheck?.status === 'vulnerable' ? 'bg-red-500' :
                  'bg-yellow-500'
                }
              >
                {companyIsolationCheck?.status || 'checking...'}
              </Badge>
            </div>
          </div>

          {/* Security Violations */}
          {securityViolations && securityViolations.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Violations Detected</strong>
                <div className="mt-2 space-y-1">
                  {securityViolations.slice(0, 3).map((violation, index) => (
                    <div key={violation.id} className="text-sm">
                      • {violation.details?.violation_type || 'Unknown violation'} 
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(violation.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {securityViolations.length > 3 && (
                    <div className="text-sm text-muted-foreground">
                      +{securityViolations.length - 3} more violations
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Company Isolation Issues */}
          {companyIsolationCheck?.issues && companyIsolationCheck.issues.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Company Isolation Issues</strong>
                <div className="mt-2 space-y-1">
                  {companyIsolationCheck.issues.map((issue, index) => (
                    <div key={index} className="text-sm">• {issue}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* All Clear */}
          {(!securityViolations || securityViolations.length === 0) && 
           companyIsolationCheck?.status === 'secure' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Security Status: All Clear</strong>
                <div className="text-sm text-muted-foreground mt-1">
                  No security violations detected. Company isolation is properly configured.
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
