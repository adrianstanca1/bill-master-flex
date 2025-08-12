
import React from "react";
import SEO from "@/components/SEO";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { TopNavigation } from "@/components/TopNavigation";
import { BusinessMetrics } from "@/components/BusinessMetrics";
import { ProjectsOverview } from "@/components/ProjectsOverview";
import { FinancialSummary } from "@/components/FinancialSummary";
import { QuickActionsPanel } from "@/components/QuickActionsPanel";

const BusinessManager: React.FC = () => {
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
              <BusinessMetrics />
              <ProjectsOverview />
              <FinancialSummary />
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
