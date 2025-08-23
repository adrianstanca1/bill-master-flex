import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  recommendation?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function SecurityStatusChecker() {
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const { toast } = useToast();

  const runSecurityChecks = useCallback(async () => {
    setLoading(true);
    const results: SecurityCheck[] = [];

    try {
      // Check authentication status
      const { data: { session } } = await supabase.auth.getSession();
      results.push({
        name: 'Authentication Status',
        status: session ? 'pass' : 'fail',
        message: session ? 'User is properly authenticated' : 'No active session',
        severity: session ? 'low' : 'high'
      });

      // Critical: Leaked Password Protection
      results.push({
        name: 'Leaked Password Protection',
        status: 'fail',
        message: 'Leaked password protection is disabled',
        recommendation: 'Enable in Supabase Dashboard → Auth → Settings → Password Security',
        severity: 'critical'
      });

      // Check RLS policies
      const { data: rlsData, error: rlsError } = await supabase.rpc('test_rls_policies');
      results.push({
        name: 'Row Level Security',
        status: rlsError ? 'fail' : 'pass',
        message: rlsError ? 'RLS policy test failed' : 'RLS policies are working correctly',
        severity: rlsError ? 'critical' : 'low'
      });

      // Check session security
      const { data: sessionData } = await supabase.rpc('validate_session_security_enhanced');
      const sessionValid = sessionData && typeof sessionData === 'object' && 'valid' in sessionData ? (sessionData as any).valid : false;
      results.push({
        name: 'Session Security',
        status: sessionValid ? 'pass' : 'warn',
        message: sessionValid ? 'Session is secure' : 'Session validation issues detected',
        recommendation: !sessionValid ? 'Review session configuration' : undefined,
        severity: sessionValid ? 'low' : 'medium'
      });

      // Check recent security events
      const { data: securityEvents } = await supabase
        .from('security_audit_log')
        .select('action, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .in('action', ['SECURITY_VIOLATION', 'UNAUTHORIZED_ACCESS', 'BRUTE_FORCE_DETECTED']);

      results.push({
        name: 'Security Events (24h)',
        status: securityEvents && securityEvents.length > 10 ? 'warn' : 'pass',
        message: `${securityEvents?.length || 0} security events in last 24 hours`,
        recommendation: securityEvents && securityEvents.length > 10 ? 'Review security logs' : undefined,
        severity: securityEvents && securityEvents.length > 10 ? 'medium' : 'low'
      });

      // Check company association
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id, enhanced_role')
        .eq('id', session?.user?.id)
        .single();

      results.push({
        name: 'Company Association',
        status: profile?.company_id ? 'pass' : 'fail',
        message: profile?.company_id ? 'User has proper company association' : 'No company association found',
        recommendation: !profile?.company_id ? 'Complete setup process' : undefined,
        severity: profile?.company_id ? 'low' : 'high'
      });

    } catch (error) {
      console.error('Security check failed:', error);
      results.push({
        name: 'Security Check System',
        status: 'fail',
        message: 'Failed to complete security checks',
        severity: 'medium'
      });
    }

    setChecks(results);
    setLoading(false);
    setLastCheck(new Date());

    // Show toast for critical issues
    const criticalIssues = results.filter(r => r.severity === 'critical' && r.status === 'fail');
    if (criticalIssues.length > 0) {
      toast({
        title: "Critical Security Issues Detected",
        description: `${criticalIssues.length} critical security issue(s) require immediate attention.`,
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    runSecurityChecks();
  }, [runSecurityChecks]);

  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (check: SecurityCheck) => {
    const variant = check.status === 'pass' ? 'default' : 
                   check.status === 'fail' ? 'destructive' : 'secondary';
    
    return (
      <Badge variant={variant} className="ml-2">
        {check.status === 'pass' ? 'Pass' : check.status === 'fail' ? 'Fail' : 'Warning'}
      </Badge>
    );
  };

  const getSeverityColor = (severity: SecurityCheck['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'high': return 'border-red-400 bg-red-25 dark:bg-red-900';
      case 'medium': return 'border-yellow-400 bg-yellow-25 dark:bg-yellow-900';
      case 'low': return 'border-green-400 bg-green-25 dark:bg-green-900';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status Checker
            </CardTitle>
            <CardDescription>
              Real-time security monitoring and validation
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {lastCheck && (
              <span className="text-sm text-muted-foreground">
                Last check: {lastCheck.toLocaleTimeString()}
              </span>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runSecurityChecks}
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Run Check'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${getSeverityColor(check.severity)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(check.status)}
                  <span className="font-medium">{check.name}</span>
                  {getStatusBadge(check)}
                  <Badge variant="outline" className="text-xs">
                    {check.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1 ml-6">
                {check.message}
              </p>
              {check.recommendation && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 ml-6">
                  Recommendation: {check.recommendation}
                </p>
              )}
            </div>
          ))}
        </div>

        {checks.some(c => c.severity === 'critical' && c.status === 'fail') && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Immediate Action Required</span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Critical security issues detected. Please address these immediately to maintain system security.
            </p>
            <Button 
              variant="destructive" 
              size="sm" 
              className="mt-2"
              onClick={() => window.open('https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/auth/settings', '_blank')}
            >
              Open Supabase Settings
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}