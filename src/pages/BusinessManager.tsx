
import React, { useMemo } from 'react';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { BusinessMetrics } from '@/components/BusinessMetrics';
import { ProjectsOverview } from '@/components/ProjectsOverview';
import { FinancialSummary } from '@/components/FinancialSummary';
import { QuickActionsPanel } from '@/components/QuickActionsPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Bell, 
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import SEO from '@/components/SEO';
import { cn } from '@/lib/utils';

export default function BusinessManager() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Mock data - in real app, this would come from APIs/hooks
  const businessData = useMemo(() => ({
    metrics: {
      revenue: {
        current: 127500,
        target: 150000,
        growth: 12.5
      },
      projects: {
        active: 8,
        completed: 23,
        pending: 5
      },
      team: {
        utilization: 87,
        capacity: 100
      }
    },
    projects: [
      {
        id: '1',
        name: 'Residential Complex - Phase 2',
        client: 'Sunrise Developments',
        location: 'Manchester',
        status: 'active' as const,
        progress: 75,
        startDate: '2024-01-15',
        endDate: '2024-04-30',
        budget: 250000,
        spent: 187500
      },
      {
        id: '2',
        name: 'Office Renovation',
        client: 'TechCorp Ltd',
        location: 'London',
        status: 'active' as const,
        progress: 45,
        startDate: '2024-02-01',
        endDate: '2024-05-15',
        budget: 180000,
        spent: 81000
      },
      {
        id: '3',
        name: 'Shopping Center Extension',
        client: 'Retail Group PLC',
        location: 'Birmingham',
        status: 'pending' as const,
        progress: 0,
        startDate: '2024-04-01',
        endDate: '2024-08-30',
        budget: 450000,
        spent: 0
      }
    ],
    financial: {
      totalRevenue: 892500,
      monthlyRevenue: 127500,
      pendingInvoices: 12,
      overdueAmount: 23750,
      profitMargin: 18.5,
      cashFlow: 45200,
      recentTransactions: [
        {
          id: '1',
          type: 'income' as const,
          description: 'Project Payment - Sunrise Developments',
          amount: 45000,
          date: '2024-01-10',
          status: 'completed' as const
        },
        {
          id: '2',
          type: 'expense' as const,
          description: 'Material Purchase - BuildSupply Co',
          amount: 12500,
          date: '2024-01-09',
          status: 'completed' as const
        },
        {
          id: '3',
          type: 'income' as const,
          description: 'Invoice Payment - TechCorp Ltd',
          amount: 28000,
          date: '2024-01-08',
          status: 'pending' as const
        }
      ]
    }
  }), []);

  const notifications = [
    { id: '1', type: 'urgent', message: 'Invoice overdue: £23,750 from multiple clients' },
    { id: '2', type: 'info', message: 'Project milestone reached for Residential Complex' },
    { id: '3', type: 'warning', message: 'Team utilization above optimal range' }
  ];

  const handleViewProject = (projectId: string) => {
    console.log('Viewing project:', projectId);
    // In real app, navigate to project details
  };

  const handleCreateProject = () => {
    console.log('Creating new project');
    // In real app, open project creation modal/page
  };

  const handleViewFinancials = () => {
    navigate('/invoices');
  };

  const handleCreateInvoice = () => {
    navigate('/invoices');
  };

  return (
    <>
      <SEO 
        title="Business Manager | Construction Project & Financial Management"
        description="Comprehensive business management dashboard for construction projects, financial tracking, team management, and performance analytics."
        keywords="construction business manager, project management, financial tracking, team management, construction dashboard"
      />
      
      <ResponsiveLayout maxWidth="full" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={cn(
              "font-bold text-foreground flex items-center gap-2",
              isMobile ? "text-2xl" : "text-3xl"
            )}>
              <Briefcase className="h-8 w-8 text-primary" />
              Business Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive project and financial management
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size={isMobile ? "sm" : "default"}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size={isMobile ? "sm" : "default"}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size={isMobile ? "sm" : "default"} onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-5 w-5 text-orange-600" />
                Important Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                      notification.type === 'urgent' ? 'bg-red-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    )} />
                    <p className="text-sm">{notification.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Business Metrics */}
        <BusinessMetrics data={businessData.metrics} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Projects Overview */}
            <ProjectsOverview 
              projects={businessData.projects}
              onViewProject={handleViewProject}
              onCreateProject={handleCreateProject}
            />
          </div>
          
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActionsPanel />
          </div>
        </div>

        {/* Financial Summary */}
        <FinancialSummary 
          data={businessData.financial}
          onViewFinancials={handleViewFinancials}
          onCreateInvoice={handleCreateInvoice}
        />
      </ResponsiveLayout>
    </>
  );
}
