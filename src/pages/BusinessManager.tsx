
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HRManager } from '@/components/HRManager';
import { BusinessGrowthAssistant } from '@/components/BusinessGrowthAssistant';
import { ComplianceAssurance } from '@/components/ComplianceAssurance';
import { OperationsScheduler } from '@/components/OperationsScheduler';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  Calendar,
  BarChart3,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import SEO from '@/components/SEO';

export default function BusinessManager() {
  const [activeTab, setActiveTab] = useState('overview');

  const businessMetrics = {
    activeProjects: 8,
    teamMembers: 12,
    complianceScore: 94,
    operationalEfficiency: 87
  };

  const alerts = [
    { id: 1, type: 'compliance', message: 'CIS300 return due in 3 days', urgent: true },
    { id: 2, type: 'hr', message: '2 training certificates expiring soon', urgent: false },
    { id: 3, type: 'operations', message: 'Material delivery scheduled for tomorrow', urgent: false }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="Business Manager" 
        description="Comprehensive business management for construction companies"
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Business Manager</h1>
        <p className="text-muted-foreground">
          Comprehensive management tools for your construction business
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hr">HR Manager</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Business Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold">{businessMetrics.activeProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                    <p className="text-2xl font-bold">{businessMetrics.teamMembers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                    <p className="text-2xl font-bold">{businessMetrics.complianceScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                    <p className="text-2xl font-bold">{businessMetrics.operationalEfficiency}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Business Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {alert.urgent ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                      <span>{alert.message}</span>
                    </div>
                    <Badge variant={alert.urgent ? 'destructive' : 'secondary'}>
                      {alert.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('hr')}>
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                <h3 className="font-semibold">HR Management</h3>
                <p className="text-sm text-muted-foreground">Manage employees & training</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('growth')}>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-green-600 mb-2" />
                <h3 className="font-semibold">Business Growth</h3>
                <p className="text-sm text-muted-foreground">Certifications & expansion</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('compliance')}>
              <CardContent className="pt-6 text-center">
                <Shield className="h-12 w-12 mx-auto text-purple-600 mb-2" />
                <h3 className="font-semibold">Compliance</h3>
                <p className="text-sm text-muted-foreground">HMRC & regulations</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('operations')}>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 mx-auto text-orange-600 mb-2" />
                <h3 className="font-semibold">Operations</h3>
                <p className="text-sm text-muted-foreground">Scheduling & resources</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hr">
          <HRManager />
        </TabsContent>

        <TabsContent value="growth">
          <BusinessGrowthAssistant />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceAssurance />
        </TabsContent>

        <TabsContent value="operations">
          <OperationsScheduler />
        </TabsContent>
      </Tabs>
    </div>
  );
}
