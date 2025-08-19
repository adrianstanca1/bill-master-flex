
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityPolicyEnforcer } from '@/components/SecurityPolicyEnforcer';
import { SecurityMonitor } from '@/components/SecurityMonitor';
import { EnhancedSecurityDashboard } from '@/components/EnhancedSecurityDashboard';
import { ThreatDetection } from '@/components/ThreatDetection';
import SEO from '@/components/SEO';

export default function Security() {
  return (
    <>
      <SEO 
        title="Security" 
        description="Comprehensive security monitoring and policy management" 
        noindex 
      />
      
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Center</h1>
          <p className="text-muted-foreground mt-2">
            Monitor security events, manage policies, and maintain system integrity
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList>
            <TabsTrigger value="dashboard">Security Dashboard</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
            <TabsTrigger value="threats">Threat Detection</TabsTrigger>
            <TabsTrigger value="policies">Security Policies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <EnhancedSecurityDashboard />
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-6">
            <SecurityMonitor />
          </TabsContent>
          
          <TabsContent value="threats" className="space-y-6">
            <ThreatDetection />
          </TabsContent>
          
          <TabsContent value="policies" className="space-y-6">
            <SecurityPolicyEnforcer />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
