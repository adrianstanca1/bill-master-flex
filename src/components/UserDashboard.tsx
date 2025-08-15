
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, AlertTriangle, User, Activity, Database, RefreshCw } from 'lucide-react';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function UserDashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState<string | null>(null);
  const [sessionStrength, setSessionStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const { suspiciousActivity, alerts, stats } = useSecurityMonitoring();
  const { systemHealth, runHealthCheck } = useSystemHealth();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setLastActivity(session?.user?.last_sign_in_at ?? null);
      
      // Evaluate session strength
      if (session) {
        const signInAge = session.user.last_sign_in_at 
          ? Date.now() - new Date(session.user.last_sign_in_at).getTime()
          : Date.now();
        
        const hoursOld = signInAge / (1000 * 60 * 60);
        
        if (hoursOld < 1) {
          setSessionStrength('strong');
        } else if (hoursOld < 24) {
          setSessionStrength('medium');
        } else {
          setSessionStrength('weak');
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? null);
      setLastActivity(session?.user?.last_sign_in_at ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getSessionBadgeColor = () => {
    switch (sessionStrength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const hasSecurityAlerts = suspiciousActivity && suspiciousActivity.some(alert => alert.type === 'high');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient">User Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Your account, security and system information
        </p>
      </div>

      {/* Security Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={alert.severity === 'high' ? 'border-red-500 bg-red-50' : alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.severity.toUpperCase()}:</strong> {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            
            {lastActivity && (
              <div>
                <label className="text-sm font-medium">Last Activity</label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(lastActivity).toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Session Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Session Strength</label>
              <Badge className={getSessionBadgeColor()}>
                <Shield className="h-3 w-3 mr-1" />
                {sessionStrength}
              </Badge>
            </div>

            {hasSecurityAlerts && (
              <div>
                <label className="text-sm font-medium">Security Status</label>
                <Badge className="bg-red-500">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Security Alert
                </Badge>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Security Events</label>
              <p className="text-sm text-muted-foreground">
                {suspiciousActivity?.length || 0} events in the last hour
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Health Card */}
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <Badge className={getStatusColor(systemHealth.database)}>
                  {systemHealth.database}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Authentication</span>
                </div>
                <Badge className={getStatusColor(systemHealth.auth)}>
                  {systemHealth.auth}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Functions</span>
                </div>
                <Badge className={getStatusColor(systemHealth.functions)}>
                  {systemHealth.functions}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active APIs</span>
                <span className="text-sm text-muted-foreground">{systemHealth.apis}</span>
              </div>
            </div>

            <Button 
              onClick={runHealthCheck}
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Health Check
            </Button>
          </CardContent>
        </Card>

        {/* Security Stats Card */}
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Events</span>
                <span className="text-sm text-muted-foreground">{stats.securityEvents}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Alerts</span>
                <span className="text-sm text-muted-foreground">{stats.totalAlerts}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Critical Alerts</span>
                <Badge className={stats.criticalAlerts > 0 ? 'bg-red-500' : 'bg-green-500'}>
                  {stats.criticalAlerts}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground">
                Last checked: {new Date(systemHealth.lastCheck).toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
