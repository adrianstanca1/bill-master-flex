
import React from "react";
import SEO from "@/components/SEO";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { TopNavigation } from "@/components/TopNavigation";
import { EnhancedSystemMonitor } from "@/components/EnhancedSystemMonitor";

const Security: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <ResponsiveLayout>
        <SEO 
          title="System Status | UK Construction" 
          description="Monitor system health and API integrations" 
        />
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">System Status</h1>
            <p className="text-muted-foreground mt-2">
              Monitor system health, API integrations, and service availability
            </p>
          </div>
          
          <EnhancedSystemMonitor />
        </div>
      </ResponsiveLayout>
    </div>
  );
};

export default Security;
