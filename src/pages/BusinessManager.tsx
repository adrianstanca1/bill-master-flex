
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Clock, Calendar, Bell, Camera, Shield, Wrench, 
  Users, TrendingUp, FileText, BarChart3, 
  MapPin, Smartphone, Zap, Brain, Package,
  Activity, AlertCircle, RefreshCcw
} from 'lucide-react';
import { TimesheetTracker } from '@/components/TimesheetTracker';
import { DayworkManager } from '@/components/DayworkManager';
import { ReminderSystem } from '@/components/ReminderSystem';
import { AssetTracker } from '@/components/AssetTracker';
import { SitePhotos } from '@/components/SitePhotos';
import RamsGenerator from '@/components/RamsGenerator';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { StatsCard } from '@/components/StatsCard';
import { QuickActions } from '@/components/QuickActions';
import { useToast } from '@/hooks/use-toast';

export default function BusinessManager() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const companyId = useCompanyId();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading, error: statsError, refetch } = useDashboardStats();

  const handleRefreshStats = async () => {
    try {
      await refetch();
      toast({
        title: "Stats refreshed",
        description: "Dashboard statistics have been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh dashboard statistics.",
        variant: "destructive",
      });
    }
  };

  const modules = [
    {
      id: 'operations',
      title: 'Operational Excellence',
      description: 'Core business operations and workflow management',
      items: [
        { icon: Clock, name: 'Time Tracking', desc: 'Real-time timesheet management', status: 'Active', tab: 'timesheets' },
        { icon: Calendar, name: 'Daily Reports', desc: 'Comprehensive daywork documentation', status: 'Active', tab: 'dayworks' },
        { icon: Bell, name: 'Smart Reminders', desc: 'AI-powered task scheduling', status: 'Active', tab: 'reminders' },
        { icon: Shield, name: 'RAMS Generator', desc: 'Risk assessment automation', status: 'Active', tab: 'rams' },
        { icon: Package, name: 'Asset Management', desc: 'Equipment and material tracking', status: 'Active', tab: 'assets' },
        { icon: Camera, name: 'Progress Photos', desc: 'Visual project documentation', status: 'Active', tab: 'photos' },
      ]
    },
    {
      id: 'intelligence',
      title: 'Business Intelligence',
      description: 'Data-driven insights and analytics',
      items: [
        { icon: BarChart3, name: 'Performance Analytics', desc: 'Real-time KPI dashboards', status: 'Coming Soon' },
        { icon: TrendingUp, name: 'Profit Analysis', desc: 'Financial performance tracking', status: 'Coming Soon' },
        { icon: Users, name: 'Workforce Analytics', desc: 'Team productivity insights', status: 'Coming Soon' },
        { icon: MapPin, name: 'Location Intelligence', desc: 'Site-based analytics', status: 'Coming Soon' },
      ]
    },
    {
      id: 'digital',
      title: 'Digital Transformation',
      description: 'Next-generation digital tools',
      items: [
        { icon: Brain, name: 'AI Assistant', desc: 'Intelligent business advisor', status: 'Beta' },
        { icon: Smartphone, name: 'Mobile App', desc: 'Field worker companion', status: 'Planned' },
        { icon: Zap, name: 'Automation Hub', desc: 'Workflow automation', status: 'Planned' },
        { icon: FileText, name: 'Document AI', desc: 'Smart document processing', status: 'Planned' },
      ]
    }
  ];

  const tabConfig = [
    { value: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { value: 'timesheets', label: 'Time Tracking', icon: Clock },
    { value: 'dayworks', label: 'Daily Reports', icon: Calendar },
    { value: 'reminders', label: 'Reminders', icon: Bell },
    { value: 'assets', label: 'Assets', icon: Package },
    { value: 'photos', label: 'Photos', icon: Camera },
    { value: 'rams', label: 'RAMS', icon: Shield },
  ];

  if (!companyId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please complete your company setup in Settings to access the Business Manager.
            </p>
            <Button onClick={() => window.location.href = '/settings'} className="w-full">
              Go to Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Manager</h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive business management platform for construction companies
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshStats}
                disabled={statsLoading}
                className="shrink-0"
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {isMobile ? (
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                  {tabConfig.map((tab) => (
                    <TabsTrigger 
                      key={tab.value} 
                      value={tab.value}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <TabsList className="grid w-full grid-cols-7">
                {tabConfig.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            )}

            <TabsContent value="dashboard" className="space-y-6">
              {/* Stats Overview */}
              {statsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="pt-4 pb-4">
                        <div className="h-16 bg-muted rounded" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : statsError ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>Failed to load dashboard statistics</p>
                      <Button onClick={handleRefreshStats} variant="outline" size="sm" className="mt-2">
                        Retry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  <StatsCard
                    title="Projects"
                    value={stats.activeProjects}
                    icon={FileText}
                    onClick={() => setActiveTab('dayworks')}
                  />
                  <StatsCard
                    title="Reminders"
                    value={stats.pendingReminders}
                    icon={Bell}
                    onClick={() => setActiveTab('reminders')}
                  />
                  <StatsCard
                    title="Active Timers"
                    value={stats.activeTimesheets}
                    icon={Clock}
                    onClick={() => setActiveTab('timesheets')}
                  />
                  <StatsCard
                    title="Reports"
                    value={stats.recentDayworks}
                    icon={Calendar}
                    onClick={() => setActiveTab('dayworks')}
                  />
                  <StatsCard
                    title="Assets"
                    value={stats.totalAssets}
                    icon={Package}
                    onClick={() => setActiveTab('assets')}
                  />
                  <StatsCard
                    title="Photos"
                    value={stats.recentPhotos}
                    icon={Camera}
                    onClick={() => setActiveTab('photos')}
                  />
                  <StatsCard
                    title="RAMS"
                    value={stats.ramsDocuments}
                    icon={Shield}
                    onClick={() => setActiveTab('rams')}
                  />
                </div>
              ) : null}

              {/* Quick Actions */}
              <QuickActions onTabChange={setActiveTab} />

              {/* Feature Modules */}
              <div className="space-y-6">
                {modules.map((module) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {module.items.map((item, index) => (
                          <div 
                            key={index} 
                            className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => item.tab && setActiveTab(item.tab)}
                          >
                            <item.icon className="h-5 w-5 mt-0.5 text-primary" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">{item.name}</h4>
                                <Badge 
                                  variant={item.status === 'Active' ? 'default' : 
                                          item.status === 'Beta' ? 'secondary' : 'outline'}
                                  className="text-xs"
                                >
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timesheets">
              <ErrorBoundary>
                <TimesheetTracker />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="dayworks">
              <ErrorBoundary>
                <DayworkManager />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="reminders">
              <ErrorBoundary>
                <ReminderSystem />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="assets">
              <ErrorBoundary>
                <AssetTracker />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="photos">
              <ErrorBoundary>
                <SitePhotos />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="rams">
              <ErrorBoundary>
                <RamsGenerator />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
}
