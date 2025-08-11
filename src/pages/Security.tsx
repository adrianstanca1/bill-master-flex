
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityMonitor } from '@/components/SecurityMonitor';
import { SecurityTester } from '@/components/SecurityTester';
import SEO from '@/components/SEO';
import { Shield, Monitor, TestTube } from 'lucide-react';

const Security = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <SEO 
        title="Security Dashboard | Business Management" 
        description="Monitor security events, test access controls, and manage security policies for your business." 
      />
      
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor security events and test your application's security controls
          </p>
        </div>
      </div>

      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Security Monitor
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Security Testing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="space-y-6">
          <SecurityMonitor />
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <SecurityTester />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;
