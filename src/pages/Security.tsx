
import React from "react";
import SEO from "@/components/SEO";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { TopNavigation } from "@/components/TopNavigation";
import { EnhancedSystemMonitor } from "@/components/EnhancedSystemMonitor";
import { FloatingElements } from "@/components/EnhancedVisualEffects";

const Security: React.FC = () => {
  return (
    <div className="page-enter">
      <TopNavigation />
      <FloatingElements>
        <ResponsiveLayout>
          <SEO 
            title="System Monitor | UK Construction" 
            description="Monitor system health and manage API integrations" 
          />
          <div className="dashboard-header animate-slide-in-right">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-shimmer-text">System Monitor</h1>
            <p className="text-text-muted animate-fade-in">Monitor system health and manage API integrations</p>
          </div>
          <div className="space-y-6">
            <EnhancedSystemMonitor />
          </div>
        </ResponsiveLayout>
      </FloatingElements>
    </div>
  );
};

export default Security;
