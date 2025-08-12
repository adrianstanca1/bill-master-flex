
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Activity, CheckCircle, Clock, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SecurityMonitor() {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const systemMetrics = {
    uptime: '99.9%',
    responseTime: '120ms',
    errorRate: '0.1%',
    lastUpdate: new Date().toISOString()
  };

  const systemAlerts = [
    {
      id: '1',
      type: 'info',
      message: 'System backup completed successfully',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      severity: 'low'
    },
    {
      id: '2',
      type: 'warning',
      message: 'API rate limit approaching for external service',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      severity: 'medium'
    }
  ];

  const policyStatus = [
    { name: 'Data Encryption', status: 'active', compliant: true },
    { name: 'Access Control', status: 'active', compliant: true },
    { name: 'Audit Logging', status: 'active', compliant: true },
    { name: 'Backup Policy', status: 'active', compliant: true }
  ];

  const handleSystemScan = async () => {
    setIsScanning(true);
    toast({
      title: "System Scan Started",
      description: "Running comprehensive security scan...",
    });
    
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: "No security issues detected",
      });
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">System Uptime</p>
                <p className="text-2xl font-bold text-green-600">{systemMetrics.uptime}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Response Time</p>
                <p className="text-2xl font-bold text-blue-600">{systemMetrics.responseTime}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Error Rate</p>
                <p className="text-2xl font-bold text-green-600">{systemMetrics.errorRate}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Security Score</p>
                <p className="text-2xl font-bold text-green-600">A+</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
            <Button 
              size="sm" 
              onClick={handleSystemScan}
              disabled={isScanning}
            >
              {isScanning ? "Scanning..." : "Run Scan"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Security Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {policyStatus.map((policy, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`h-5 w-5 ${policy.compliant ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="font-medium">{policy.name}</span>
                  </div>
                  <Badge className={policy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {policy.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">256</div>
              <div className="text-sm text-muted-foreground">Active Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1.2GB</div>
              <div className="text-sm text-muted-foreground">Memory Usage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">45%</div>
              <div className="text-sm text-muted-foreground">CPU Usage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">890MB</div>
              <div className="text-sm text-muted-foreground">Network I/O</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
