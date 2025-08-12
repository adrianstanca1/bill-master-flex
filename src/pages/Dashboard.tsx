
import React from "react";
import SEO from "@/components/SEO";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { TopNavigation } from "@/components/TopNavigation";
import { DashboardOverview } from "@/components/DashboardOverview";
import { RemindersWidget } from "@/components/RemindersWidget";
import { HMRCConnections } from "@/components/HMRCConnections";
import { BankingConnections } from "@/components/BankingConnections";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <ResponsiveLayout>
        <SEO 
          title="Dashboard | UK Construction" 
          description="Your construction business dashboard" 
        />
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Overview of your construction business performance
            </p>
          </div>
          
          <DashboardOverview />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RemindersWidget />
            <HMRCConnections />
            <BankingConnections />
          </div>
        </div>
      </ResponsiveLayout>
    </div>
  );
};

export default Dashboard;
