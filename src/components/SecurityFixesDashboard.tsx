import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Eye,
  Lock,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityMetrics {
  totalEvents: number;
  criticalAlerts: number;
  blockedThreats: number;
  sessionSecurity: number;
}

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  created_at: string;
  details: any;
}

export function SecurityFixesDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalAlerts: 0,
    blockedThreats: 0,
    sessionSecurity: 100
  });
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingRLS, setTestingRLS] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      // Load security metrics
      const { data: auditLogs } = await supabase
        .from('security_audit_log')
        .select('action, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      const { data: securityEvents } = await supabase
        .from('security_events')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate metrics
      const totalEvents = auditLogs?.length || 0;
      const criticalAlerts = securityEvents?.filter(e => e.severity === 'critical').length || 0;
      const blockedThreats = auditLogs?.filter(log => 
        log.action.includes('THREAT') || log.action.includes('BLOCKED')
      ).length || 0;

      setMetrics({
        totalEvents,
        criticalAlerts,
        blockedThreats,
        sessionSecurity: criticalAlerts === 0 ? 100 : Math.max(0, 100 - (criticalAlerts * 10))
      });

      setRecentEvents(securityEvents || []);
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const testRLSPolicies = async () => {
    setTestingRLS(true);
    try {
      const { data, error } = await supabase.rpc('test_rls_policies');
      
      if (error) {
        toast({
          title: "RLS Test Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        const allPassed = data?.every((result: any) => result.result);
        toast({
          title: allPassed ? "RLS Tests Passed" : "RLS Tests Failed",
          description: `${data?.length || 0} policy tests completed`,
          variant: allPassed ? "default" : "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Test Error",
        description: "Failed to run RLS policy tests",
        variant: "destructive",
      });
    } finally {
      setTestingRLS(false);
    }
  };

  const validateSessionSecurity = async () => {
    try {
      const { data } = await supabase.rpc('validate_session_security_enhanced');
      
      if (data) {
        const sessionData = data as any;
        toast({
          title: sessionData.valid ? "Session Valid" : "Session Issues",
          description: sessionData.reason || "Session validation completed",
          variant: sessionData.valid ? "default" : "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Failed to validate session security",
        variant: "destructive",
      });
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Eye className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'events':
        return <Shield className="h-8 w-8 text-blue-500" />;
      case 'alerts':
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      case 'threats':
        return <Lock className="h-8 w-8 text-orange-500" />;
      case 'security':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      default:
        return <Shield className="h-8 w-8 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">Loading security dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor security events and validate system integrity
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={validateSessionSecurity}
            variant="outline"
            size="sm"
          >
            <Shield className="h-4 w-4 mr-2" />
            Validate Session
          </Button>
          <Button 
            onClick={testRLSPolicies}
            disabled={testingRLS}
            variant="outline"
            size="sm"
          >
            <Lock className="h-4 w-4 mr-2" />
            {testingRLS ? 'Testing...' : 'Test RLS'}
          </Button>
        </div>
      </div>

      {/* Security Status Alert */}
      {metrics.criticalAlerts > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Critical Security Alerts Detected:</strong> {metrics.criticalAlerts} critical security events require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            {getMetricIcon('events')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            {getMetricIcon('alerts')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Threats</CardTitle>
            {getMetricIcon('threats')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.blockedThreats}</div>
            <p className="text-xs text-muted-foreground">Successfully prevented</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            {getMetricIcon('security')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sessionSecurity}%</div>
            <Progress value={metrics.sessionSecurity} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="fixes">Security Fixes</TabsTrigger>
          <TabsTrigger value="monitoring">Active Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>
                Latest security events from the past 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No security events in the last 24 hours
                  </p>
                ) : (
                  recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(event.severity)}
                        <div>
                          <p className="font-medium">{event.event_type.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        event.severity === 'critical' ? 'destructive' :
                        event.severity === 'high' ? 'default' :
                        'secondary'
                      }>
                        {event.severity}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fixes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Implemented Security Fixes</CardTitle>
              <CardDescription>
                Critical security vulnerabilities that have been resolved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">OAuth State Token Security</p>
                    <p className="text-sm text-green-600">Fixed public access vulnerability in OAuth state validation</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">Enhanced Input Sanitization</p>
                    <p className="text-sm text-green-600">Implemented threat detection and server-side validation</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">Rate Limiting Enhancement</p>
                    <p className="text-sm text-green-600">Advanced rate limiting with IP-based blocking</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">Session Security Validation</p>
                    <p className="text-sm text-green-600">Enhanced session validation with suspicious activity detection</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">Server-Side Security Logging</p>
                    <p className="text-sm text-green-600">Tamper-proof logging with secure edge function</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Security Monitoring</CardTitle>
              <CardDescription>
                Real-time security monitoring and threat detection systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Brute Force Protection</p>
                      <p className="text-sm text-muted-foreground">Active monitoring for failed login attempts</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Input Threat Detection</p>
                      <p className="text-sm text-muted-foreground">Real-time analysis of form submissions</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Session Monitoring</p>
                      <p className="text-sm text-muted-foreground">Continuous validation of user sessions</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">RLS Policy Enforcement</p>
                      <p className="text-sm text-muted-foreground">Row-level security policy validation</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}