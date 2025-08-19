
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Clock, Eye, Lock } from 'lucide-react';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';
import { useToast } from '@/hooks/use-toast';

export function EnhancedSecurityDashboard() {
  const {
    profile,
    securityMetrics,
    recentAlerts,
    testSecurityPolicies,
    logSecurityEvent,
    isAdmin,
    isMonitoring
  } = useEnhancedSecurity();
  
  const { toast } = useToast();

  // Show critical alerts as toasts
  useEffect(() => {
    if (recentAlerts && recentAlerts.length > 0) {
      const criticalAlerts = recentAlerts.filter(alert => alert.type === 'critical');
      criticalAlerts.forEach(alert => {
        toast({
          title: "Critical Security Alert",
          description: alert.message,
          variant: "destructive",
        });
      });
    }
  }, [recentAlerts, toast]);

  if (!isAdmin) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Security monitoring is only available to administrators.
        </AlertDescription>
      </Alert>
    );
  }

  const handleTestSecurity = () => {
    testSecurityPolicies.mutate();
    logSecurityEvent.mutate({
      action: 'SECURITY_TEST_INITIATED',
      resourceType: 'security_policies',
      details: { initiated_by: profile?.id }
    });
  };

  const getSecurityScore = () => {
    if (!securityMetrics) return 0;
    
    let score = 100;
    score -= securityMetrics.criticalAlerts * 20;
    score -= securityMetrics.failedLogins * 5;
    score -= securityMetrics.privilegeEscalationAttempts * 30;
    score -= securityMetrics.unauthorizedAccessAttempts * 10;
    
    return Math.max(0, score);
  };

  const securityScore = getSecurityScore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Security Score</p>
                <p className={`text-2xl font-bold ${
                  securityScore >= 90 ? 'text-green-600' :
                  securityScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {securityScore}%
                </p>
              </div>
              <Shield className={`h-8 w-8 ${
                securityScore >= 90 ? 'text-green-600' :
                securityScore >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {securityMetrics?.criticalAlerts || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Failed Logins</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {securityMetrics?.failedLogins || 0}
                </p>
              </div>
              <Lock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Events</p>
                <p className="text-2xl font-bold text-blue-600">
                  {securityMetrics?.totalEvents || 0}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Security Alerts
            </CardTitle>
            <Button 
              size="sm" 
              onClick={handleTestSecurity}
              disabled={testSecurityPolicies.isPending}
            >
              {testSecurityPolicies.isPending ? "Testing..." : "Test Security"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts && recentAlerts.length > 0 ? (
                recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.type}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No recent security alerts
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication Required</span>
                <Badge variant="default">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Role-Based Access Control</span>
                <Badge variant="default">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Company Isolation</span>
                <Badge variant="default">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Protected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Audit Logging</span>
                <Badge variant="default">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Privilege Escalation Protection</span>
                <Badge variant="default">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enforced
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {securityScore < 70 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your security score is below recommended levels. Please review recent alerts and take appropriate action.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
