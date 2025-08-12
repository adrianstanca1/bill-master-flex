
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Eye, Settings, Users, AlertTriangle, Activity, Bot } from 'lucide-react';
import { SecurityMonitor } from '@/components/SecurityMonitor';
import { SecurityTester } from '@/components/SecurityTester';
import { SessionManager } from '@/components/SessionManager';
import { ThreatDetection } from '@/components/ThreatDetection';
import { ServiceStatusChecker } from '@/components/ServiceStatusChecker';
import { AgentsDashboard } from '@/components/AgentsDashboard';
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
            Service status monitoring, AI agents management, and security testing
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="service-status" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Agents</span>
            </TabsTrigger>
            <TabsTrigger value="threats" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Threats</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Sessions</span>
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
                      <p className="text-sm font-medium">Active Services</p>
                      <p className="text-2xl font-bold text-green-600">8/10</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">AI Agents</p>
                      <p className="text-2xl font-bold text-blue-600">6</p>
                    </div>
                    <Bot className="h-8 w-8 text-blue-600" />
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
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('service-status')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    Service Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Check API keys and service functionality</p>
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between">
                      <span>Services Online:</span>
                      <span className="font-semibold text-green-600">8/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('agents')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-500" />
                    AI Agents Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Manage and monitor AI agents performance</p>
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between">
                      <span>Active Agents:</span>
                      <span className="font-semibold">6</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <SecurityMonitor />
          </TabsContent>

          <TabsContent value="service-status">
            <ServiceStatusChecker />
          </TabsContent>

          <TabsContent value="agents">
            <AgentsDashboard />
          </TabsContent>

          <TabsContent value="threats">
            <ThreatDetection />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionManager />
          </TabsContent>

          <TabsContent value="testing">
            <SecurityTester />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
