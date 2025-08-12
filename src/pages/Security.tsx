
import React from "react";
import SEO from "@/components/SEO";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";

import { EnhancedSystemMonitor } from "@/components/EnhancedSystemMonitor";

const Security: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      
      <ResponsiveLayout>
        <SEO 
          title="System Monitor | UK Construction" 
          description="Monitor system health and manage API integrations" 
        />
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">System Monitor</h1>
            <p className="text-muted-foreground mt-2">
              Monitor system health and manage API integrations
            </p>
          </div>
          
          <EnhancedSystemMonitor />
        </div>
      </ResponsiveLayout>
    </div>
  );
};

export default Security;
