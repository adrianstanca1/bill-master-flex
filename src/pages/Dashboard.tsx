
import React from "react";
import SEO from "@/components/SEO";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { TopNavigation } from "@/components/TopNavigation";
import { DashboardOverview } from "@/components/DashboardOverview";
import { FloatingElements } from "@/components/EnhancedVisualEffects";

const Dashboard: React.FC = () => {
  return (
    <div className="page-enter">
      <TopNavigation />
      <FloatingElements>
        <ResponsiveLayout>
          <SEO 
            title="Dashboard | UK Construction" 
            description="Your construction business dashboard" 
          />
          <div className="dashboard-header animate-slide-in-right">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-shimmer-text">Dashboard</h1>
            <p className="text-text-muted animate-fade-in">
              Overview of your construction business performance
            </p>
          </div>
          <div className="space-y-6">
            <DashboardOverview />
          </div>
        </ResponsiveLayout>
      </FloatingElements>
    </div>
  );
};

export default Dashboard;
