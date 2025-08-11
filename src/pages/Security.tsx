
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Eye, Settings, Users, AlertTriangle, Activity } from 'lucide-react';
import { SecurityMonitor } from '@/components/SecurityMonitor';
import { SecurityTester } from '@/components/SecurityTester';
import { SessionManager } from '@/components/SessionManager';
import { SecurityPolicyEnforcer } from '@/components/SecurityPolicyEnforcer';
import { ThreatDetection } from '@/components/ThreatDetection';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import SEO from '@/components/SEO';

export default function Security() {
  const [activeTab, setActiveTab] = useState('overview');
  const { alerts, stats } = useSecurityMonitoring();
  
  // Initialize session management with security policies
  useSessionManagement({
    timeoutMinutes: 60,
    warningMinutes: 5,
    enableWarning: true
  });

  const securityMetrics = {
    totalAlerts: alerts.length,
    criticalAlerts: alerts.filter(a => a.severity === 'high').length,
    activeThreats: stats?.securityEvents || 0,
    securityScore: 85 // This would be calculated based on various factors
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Security Center | Advanced Security Management" 
        description="Comprehensive security monitoring, threat detection, and policy management for your organization." 
        noindex 
      />
      
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Security Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced security monitoring, threat detection, and policy management
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Monitoring</span>
            </TabsTrigger>
            <TabsTrigger value="threats" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Threats</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Policies</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Testing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Security Overview Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Security Score</p>
                      <p className={`text-2xl font-bold ${
                        securityMetrics.securityScore >= 80 ? 'text-green-600' :
                        securityMetrics.securityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {securityMetrics.securityScore}%
                      </p>
                    </div>
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Active Alerts</p>
                      <p className="text-2xl font-bold text-orange-600">{securityMetrics.totalAlerts}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Critical Threats</p>
                      <p className="text-2xl font-bold text-red-600">{securityMetrics.criticalAlerts}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Security Events</p>
                      <p className="text-2xl font-bold">{securityMetrics.activeThreats}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('threats')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Threat Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Monitor and respond to security threats in real-time</p>
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between">
                      <span>Active Threats:</span>
                      <span className="font-semibold text-red-600">{securityMetrics.criticalAlerts}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('monitoring')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Security Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Real-time security event monitoring and alerts</p>
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between">
                      <span>Events Today:</span>
                      <span className="font-semibold">{stats?.securityEvents || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <SecurityMonitor />
          </TabsContent>

          <TabsContent value="threats">
            <ThreatDetection />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionManager />
          </TabsContent>

          <TabsContent value="policies">
            <SecurityPolicyEnforcer />
          </TabsContent>

          <TabsContent value="testing">
            <SecurityTester />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
