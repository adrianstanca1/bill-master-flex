
import React from "react";
import SEO from "@/components/SEO";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { TopNavigation } from "@/components/TopNavigation";
import { BusinessMetrics } from "@/components/BusinessMetrics";
import { ProjectsOverview } from "@/components/ProjectsOverview";
import { FinancialSummary } from "@/components/FinancialSummary";
import { QuickActionsPanel } from "@/components/QuickActionsPanel";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useNavigate } from "react-router-dom";

const BusinessManager: React.FC = () => {
  const navigate = useNavigate();
  const { totalRevenue, pendingInvoices, overdueAmount, activeProjects, recentInvoices, loading } = useDashboardStats();

  // Mock data for BusinessMetrics
  const businessMetricsData = {
    revenue: {
      current: totalRevenue,
      target: totalRevenue * 1.2, // 20% above current as target
      growth: 12.5
    },
    projects: {
      active: activeProjects,
      completed: Math.floor(activeProjects * 0.8),
      pending: Math.floor(activeProjects * 0.3)
    },
    team: {
      utilization: 85,
      capacity: 100
    }
  };

  // Mock projects data
  const mockProjects = [
    {
      id: "1",
      name: "Office Complex Development",
      client: "ABC Construction Ltd",
      location: "London, UK",
      status: "active" as const,
      progress: 65,
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      budget: 250000,
      spent: 162500
    },
    {
      id: "2",
      name: "Residential Extension",
      client: "Johnson Family",
      location: "Birmingham, UK",
      status: "pending" as const,
      progress: 0,
      startDate: "2024-03-01",
      endDate: "2024-08-15",
      budget: 85000,
      spent: 0
    }
  ];

  // Financial summary data
  const financialData = {
    totalRevenue,
    monthlyRevenue: totalRevenue * 0.1, // Assume 10% is monthly
    pendingInvoices,
    overdueAmount,
    profitMargin: 15.2,
    cashFlow: totalRevenue * 0.15,
    recentTransactions: recentInvoices.map((invoice, index) => ({
      id: invoice.id,
      type: 'income' as const,
      description: `Payment from ${invoice.client || 'Client'}`,
      amount: Number(invoice.total || 0),
      date: invoice.created_at,
      status: invoice.status === 'paid' ? 'completed' as const : 'pending' as const
    })).slice(0, 5)
  };

  const handleViewProject = (id: string) => {
    console.log('Viewing project:', id);
    // Navigate to project details when implemented
  };

  const handleCreateProject = () => {
    console.log('Creating new project');
    // Navigate to project creation when implemented
  };

  const handleViewFinancials = () => {
    navigate('/invoices');
  };

  const handleCreateInvoice = () => {
    navigate('/invoices');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <ResponsiveLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </ResponsiveLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <ResponsiveLayout>
        <SEO 
          title="Business Manager | UK Construction" 
          description="Comprehensive business management and analytics" 
        />
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Business Manager</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive overview and management of your construction business
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <BusinessMetrics data={businessMetricsData} />
              <ProjectsOverview 
                projects={mockProjects}
                onViewProject={handleViewProject}
                onCreateProject={handleCreateProject}
              />
              <FinancialSummary 
                data={financialData}
                onViewFinancials={handleViewFinancials}
                onCreateInvoice={handleCreateInvoice}
              />
            </div>
            <div>
              <QuickActionsPanel />
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    </div>
  );
};

export default BusinessManager;
