
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, Calendar, Bell, Camera, Shield, Wrench, 
  Users, TrendingUp, FileText, BarChart3, 
  MapPin, Smartphone, Zap, Brain
} from 'lucide-react';
import { TimesheetTracker } from '@/components/TimesheetTracker';
import { DayworkManager } from '@/components/DayworkManager';
import { ReminderSystem } from '@/components/ReminderSystem';
import { RamsGenerator } from '@/components/RamsGenerator';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';

export default function BusinessManager() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const companyId = useCompanyId();

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      
      const [
        { count: activeProjects },
        { count: pendingReminders },
        { count: activeTimesheets },
        { count: recentDayworks }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('company_id', companyId),
        supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('company_id', companyId).eq('status', 'pending'),
        supabase.from('timesheets').select('*', { count: 'exact', head: true }).eq('company_id', companyId).eq('status', 'active'),
        supabase.from('dayworks').select('*', { count: 'exact', head: true }).eq('company_id', companyId).gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      ]);

      return {
        activeProjects: activeProjects || 0,
        pendingReminders: pendingReminders || 0,
        activeTimesheets: activeTimesheets || 0,
        recentDayworks: recentDayworks || 0,
      };
    },
    enabled: !!companyId,
  });

  const quickActions = [
    { icon: Clock, label: 'Start Timer', action: () => setActiveTab('timesheets'), color: 'text-blue-600' },
    { icon: Calendar, label: 'Add Daywork', action: () => setActiveTab('dayworks'), color: 'text-green-600' },
    { icon: Bell, label: 'Set Reminder', action: () => setActiveTab('reminders'), color: 'text-yellow-600' },
    { icon: Shield, label: 'Create RAMS', action: () => setActiveTab('rams'), color: 'text-red-600' },
  ];

  const modules = [
    {
      id: 'operations',
      title: 'Operational Excellence',
      description: 'Core business operations and workflow management',
      items: [
        { icon: Clock, name: 'Time Tracking', desc: 'Real-time timesheet management', status: 'Active' },
        { icon: Calendar, name: 'Daily Reports', desc: 'Comprehensive daywork documentation', status: 'Active' },
        { icon: Bell, name: 'Smart Reminders', desc: 'AI-powered task scheduling', status: 'Active' },
        { icon: Shield, name: 'RAMS Generator', desc: 'Risk assessment automation', status: 'Active' },
        { icon: Wrench, name: 'Asset Management', desc: 'Equipment and material tracking', status: 'Coming Soon' },
        { icon: Camera, name: 'Progress Photos', desc: 'Visual project documentation', status: 'Coming Soon' },
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Business Manager</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive business management platform for construction companies
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="timesheets">Time Tracking</TabsTrigger>
            <TabsTrigger value="dayworks">Daily Reports</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="rams">RAMS</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Overview */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                        <p className="text-2xl font-bold">{stats.activeProjects}</p>
                      </div>
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Reminders</p>
                        <p className="text-2xl font-bold">{stats.pendingReminders}</p>
                      </div>
                      <Bell className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Timers</p>
                        <p className="text-2xl font-bold">{stats.activeTimesheets}</p>
                      </div>
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Recent Reports</p>
                        <p className="text-2xl font-bold">{stats.recentDayworks}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-muted-foreground" />
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={action.action}
                    >
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                      <span className="text-sm">{action.label}</span>
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
                    <CardTitle>{module.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {module.items.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
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

          <TabsContent value="rams">
            <RamsGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
