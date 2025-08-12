import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { TopNavigation } from '@/components/TopNavigation';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RemindersWidget } from '@/components/RemindersWidget';
import { supabase } from '@/integrations/supabase/client';

const SiteManager: React.FC = () => {
  const [stats, setStats] = useState({ projects: 0, active: 0, pending: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const { data: projects } = await supabase.from('projects').select('id, status');
        const total = projects?.length || 0;
        const active = (projects || []).filter((p: any) => p.status === 'active').length;
        const pending = (projects || []).filter((p: any) => p.status !== 'active').length;
        setStats({ projects: total, active, pending });
      } catch {}
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <ResponsiveLayout>
        <SEO title="Site Manager Dashboard" description="Operational view for site managers: tasks, projects, reminders, and actions." />
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Site Manager</h1>
          <p className="text-muted-foreground">Today’s operations overview</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-md border">
                <div className="text-sm text-muted-foreground">Total projects</div>
                <div className="text-2xl font-bold">{stats.projects}</div>
              </div>
              <div className="p-4 rounded-md border">
                <div className="text-sm text-muted-foreground">Active</div>
                <div className="text-2xl font-bold">{stats.active}</div>
              </div>
              <div className="p-4 rounded-md border">
                <div className="text-sm text-muted-foreground">Pending</div>
                <div className="text-2xl font-bold">{stats.pending}</div>
              </div>
            </CardContent>
          </Card>

          <RemindersWidget />

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Open Actions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Connect HMRC (VAT, CIS, RTI) and Banking to unlock live actions here.
            </CardContent>
          </Card>
        </div>
      </ResponsiveLayout>
    </div>
  );
};

export default SiteManager;
