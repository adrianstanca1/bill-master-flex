
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
  Image, Activity, AlertCircle
} from 'lucide-react';
import { TimesheetTracker } from '@/components/TimesheetTracker';
import { DayworkManager } from '@/components/DayworkManager';
import { ReminderSystem } from '@/components/ReminderSystem';
import { AssetTracker } from '@/components/AssetTracker';
import { SitePhotos } from '@/components/SitePhotos';
import RamsGenerator from '@/components/RamsGenerator';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useIsMobile } from '@/hooks/use-mobile';

export default function BusinessManager() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const companyId = useCompanyId();
  const isMobile = useIsMobile();

  // Fetch comprehensive dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      
      const [
        { count: activeProjects },
        { count: pendingReminders },
        { count: activeTimesheets },
        { count: recentDayworks },
        { count: totalAssets },
        { count: recentPhotos },
        { count: ramsDocuments }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('company_id', companyId),
        supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('company_id', companyId).eq('status', 'pending'),
        supabase.from('timesheets').select('*', { count: 'exact', head: true }).eq('company_id', companyId).eq('status', 'active'),
        supabase.from('dayworks').select('*', { count: 'exact', head: true }).eq('company_id', companyId).gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        supabase.from('asset_tracking').select('*', { count: 'exact', head: true }).eq('company_id', companyId),
        supabase.from('site_photos').select('*', { count: 'exact', head: true }).eq('company_id', companyId).gte('photo_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('rams_documents').select('*', { count: 'exact', head: true }).eq('company_id', companyId)
      ]);

      return {
        activeProjects: activeProjects || 0,
        pendingReminders: pendingReminders || 0,
        activeTimesheets: activeTimesheets || 0,
        recentDayworks: recentDayworks || 0,
        totalAssets: totalAssets || 0,
        recentPhotos: recentPhotos || 0,
        ramsDocuments: ramsDocuments || 0,
      };
    },
    enabled: !!companyId,
  });

  const quickActions = [
    { icon: Clock, label: 'Start Timer', action: () => setActiveTab('timesheets'), color: 'text-blue-600' },
    { icon: Calendar, label: 'Add Daywork', action: () => setActiveTab('dayworks'), color: 'text-green-600' },
    { icon: Bell, label: 'Set Reminder', action: () => setActiveTab('reminders'), color: 'text-yellow-600' },
    { icon: Camera, label: 'Upload Photo', action: () => setActiveTab('photos'), color: 'text-purple-600' },
    { icon: Package, label: 'Track Asset', action: () => setActiveTab('assets'), color: 'text-indigo-600' },
    { icon: Shield, label: 'Create RAMS', action: () => setActiveTab('rams'), color: 'text-red-600' },
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Manager</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive business management platform for construction companies
          </p>
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
            {/* Enhanced Stats Overview */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Projects</p>
                        <p className="text-xl md:text-2xl font-bold">{stats.activeProjects}</p>
                      </div>
                      <FileText className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Reminders</p>
                        <p className="text-xl md:text-2xl font-bold">{stats.pendingReminders}</p>
                      </div>
                      <Bell className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Active Timers</p>
                        <p className="text-xl md:text-2xl font-bold">{stats.activeTimesheets}</p>
                      </div>
                      <Clock className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Reports</p>
                        <p className="text-xl md:text-2xl font-bold">{stats.recentDayworks}</p>
                      </div>
                      <Calendar className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Assets</p>
                        <p className="text-xl md:text-2xl font-bold">{stats.totalAssets}</p>
                      </div>
                      <Package className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Photos</p>
                        <p className="text-xl md:text-2xl font-bold">{stats.recentPhotos}</p>
                      </div>
                      <Camera className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">RAMS</p>
                        <p className="text-xl md:text-2xl font-bold">{stats.ramsDocuments}</p>
                      </div>
                      <Shield className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-16 md:h-20 flex-col gap-2"
                      onClick={action.action}
                    >
                      <action.icon className={`h-5 w-5 md:h-6 md:w-6 ${action.color}`} />
                      <span className="text-xs md:text-sm">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

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
            <TimesheetTracker />
          </TabsContent>

          <TabsContent value="dayworks">
            <DayworkManager />
          </TabsContent>

          <TabsContent value="reminders">
            <ReminderSystem />
          </TabsContent>

          <TabsContent value="assets">
            <AssetTracker />
          </TabsContent>

          <TabsContent value="photos">
            <SitePhotos />
          </TabsContent>

          <TabsContent value="rams">
            <RamsGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
