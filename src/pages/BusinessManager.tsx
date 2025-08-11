import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { DashboardGrid } from '@/components/DashboardGrid';
import { EnhancedStatsCard } from '@/components/EnhancedStatsCard';
import { HRManager } from '@/components/HRManager';
import { BusinessGrowthAssistant } from '@/components/BusinessGrowthAssistant';
import { ComplianceAssurance } from '@/components/ComplianceAssurance';
import { OperationsScheduler } from '@/components/OperationsScheduler';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  Calendar,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Activity,
  Target
} from 'lucide-react';
import SEO from '@/components/SEO';
import { cn } from '@/lib/utils';

export default function BusinessManager() {
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();

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

  const tabsData = [
    { value: 'overview', label: 'Overview', icon: BarChart3 },
    { value: 'hr', label: 'HR Manager', icon: Users },
    { value: 'growth', label: 'Growth', icon: TrendingUp },
    { value: 'compliance', label: 'Compliance', icon: Shield },
    { value: 'operations', label: 'Operations', icon: Calendar }
  ];

  return (
    <>
      <SEO 
        title="Business Manager | Construction Management Suite"
        description="Comprehensive business management tools for construction companies - HR management, compliance tracking, growth assistance, and operations scheduling."
        keywords="construction management, HR tools, compliance tracking, business growth, operations management"
      />
      
      <ResponsiveLayout maxWidth="full">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className={cn(
                  "font-bold text-foreground",
                  isMobile ? "text-2xl" : "text-3xl"
                )}>
                  Business Manager
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive management tools for your construction business
                </p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className={cn(
              "grid w-full",
              isMobile ? "grid-cols-3" : "grid-cols-5",
              isMobile && "h-auto p-1"
            )}>
              {tabsData.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className={cn(
                    "flex items-center gap-2",
                    isMobile && "flex-col text-xs py-2 px-1"
                  )}
                >
                  <tab.icon className={cn(
                    isMobile ? "h-4 w-4" : "h-4 w-4"
                  )} />
                  <span className={isMobile ? "hidden" : ""}>{tab.label}</span>
                  {isMobile && <span className="text-xs">{tab.label}</span>}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Business Metrics */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Business Metrics</h2>
                </div>
                
                <DashboardGrid columns={isMobile ? 2 : 4} gap="md">
                  <EnhancedStatsCard
                    title="Active Projects"
                    value={businessMetrics.activeProjects}
                    icon={Building2}
                    trend={{ value: 14.3, isPositive: true }}
                    description="Currently running projects"
                  />
                  <EnhancedStatsCard
                    title="Team Members"
                    value={businessMetrics.teamMembers}
                    icon={Users}
                    trend={{ value: 8.3, isPositive: true }}
                    description="Active workforce"
                    onClick={() => setActiveTab('hr')}
                  />
                  <EnhancedStatsCard
                    title="Compliance Score"
                    value={`${businessMetrics.complianceScore}%`}
                    icon={Shield}
                    trend={{ value: 2.1, isPositive: true }}
                    description="Regulatory compliance"
                    onClick={() => setActiveTab('compliance')}
                  />
                  <EnhancedStatsCard
                    title="Efficiency"
                    value={`${businessMetrics.operationalEfficiency}%`}
                    icon={Activity}
                    trend={{ value: 5.2, isPositive: true }}
                    description="Operational efficiency"
                    onClick={() => setActiveTab('operations')}
                  />
                </DashboardGrid>
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
      </ResponsiveLayout>
    </>
  );
}
