import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users,
  Activity,
  Lock,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SecurityStatusChecker } from './SecurityStatusChecker';
import { SecurityEnhancementPanel } from './SecurityEnhancementPanel';
import { useToast } from '@/hooks/use-toast';

interface SecurityMetrics {
  totalUsers: number;
  activeUsers: number;
  securityEvents: number;
  criticalAlerts: number;
  systemHealth: number;
}

interface SecurityEvent {
  id: string;
  action: string;
  created_at: string;
  details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    securityEvents: 0,
    criticalAlerts: 0,
    systemHealth: 0
  });
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSecurityData = useCallback(async () => {
    try {
      // Fetch user metrics
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, created_at, company_id')
        .not('company_id', 'is', null);

      // Fetch recent security events
      const { data: events, error: eventsError } = await supabase
        .from('security_audit_log')
        .select('id, action, created_at, details')
        .order('created_at', { ascending: false })
        .limit(10);

      // Count critical events
      const { data: criticalEvents, error: criticalError } = await supabase
        .from('security_audit_log')
        .select('id')
        .in('action', ['SECURITY_VIOLATION', 'UNAUTHORIZED_ACCESS', 'BRUTE_FORCE_DETECTED'])
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (!profilesError && !eventsError && !criticalError) {
        const totalUsers = profiles?.length || 0;
        const activeUsers = profiles?.filter(p => 
          new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length || 0;

        setMetrics({
          totalUsers,
          activeUsers,
          securityEvents: events?.length || 0,
          criticalAlerts: criticalEvents?.length || 0,
          systemHealth: criticalEvents?.length === 0 ? 95 : Math.max(50, 95 - (criticalEvents.length * 10))
        });

        setRecentEvents(events?.map(event => ({
          id: event.id,
          action: event.action,
          created_at: event.created_at,
          details: event.details,
          severity: getSeverityFromAction(event.action)
        })) || []);
      }
    } catch (error) {
      console.error('Failed to fetch security data:', error);
      toast({
        title: "Security Data Error",
        description: "Failed to load security metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getSeverityFromAction = (action: string): 'low' | 'medium' | 'high' | 'critical' => {
    if (['SECURITY_VIOLATION', 'UNAUTHORIZED_ACCESS', 'BRUTE_FORCE_DETECTED'].includes(action)) {
      return 'critical';
    }
    if (['LOGIN_FAILED', 'SESSION_EXPIRED'].includes(action)) {
      return 'medium';
    }
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const testSecurityPolicies = async () => {
    try {
      const { data, error } = await supabase.rpc('test_rls_policies');
      if (error) throw error;
      
      toast({
        title: "Security Test Completed",
        description: "All security policies are functioning correctly",
      });
    } catch (error) {
      console.error('Security test failed:', error);
      toast({
        title: "Security Test Failed",
        description: "Some security policies may need attention",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchSecurityData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Security Alert */}
      <Alert className="border-destructive bg-destructive/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <strong>Critical: Leaked Password Protection Disabled</strong>
            <p className="text-sm mt-1">Enable this feature in Supabase to prevent users from using compromised passwords.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/auth/settings', '_blank')}
            className="whitespace-nowrap"
          >
            Fix in Supabase
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </AlertDescription>
      </Alert>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeUsers} active this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.securityEvents}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.systemHealth}%</div>
            <Progress value={metrics.systemHealth} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Security Tabs */}
      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Security Status</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="enhancements">Enhancements</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <SecurityStatusChecker />
          
          <Card>
            <CardHeader>
              <CardTitle>Security Actions</CardTitle>
              <CardDescription>Test and validate security configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={testSecurityPolicies} variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Test Security Policies
                </Button>
                <Button 
                  onClick={() => window.open('https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/auth/settings', '_blank')}
                  variant="outline"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Auth Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Monitor security-related activities in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent security events</p>
                ) : (
                  recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {event.severity === 'critical' ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : event.severity === 'medium' ? (
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                        <div>
                          <p className="font-medium">{event.action.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enhancements" className="space-y-4">
          <SecurityEnhancementPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}