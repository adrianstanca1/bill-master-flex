
import React from "react";
import SEO from "@/components/SEO";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { QuickStatsGrid } from "@/components/QuickStatsGrid";
import { ProjectMetrics } from "@/components/ProjectMetrics";
import { RecentActivity } from "@/components/RecentActivity";
import { TimesheetTracker } from "@/components/TimesheetTracker";
import { RemindersWidget } from "@/components/RemindersWidget";
import { GuestBanner } from "@/components/GuestBanner";

const Dashboard: React.FC = () => {
  return (
    <>
      <SEO 
        title="Dashboard | AS PRO" 
        description="Your construction business dashboard with real-time metrics, project tracking, and team management tools."
      />
      <ResponsiveLayout>
        <div className="space-y-8 animate-fade-in">
          <GuestBanner />
          
          <div className="cyber-card p-8 hover-glow">
            <h1 className="text-4xl font-bold text-gradient mb-3">Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Command center for your construction business operations
            </p>
          </div>

          {/* Quick Stats */}
          <div className="cyber-grid">
            <QuickStatsGrid />
          </div>

          {/* Project Metrics */}
          <div className="cyber-card p-6 hover-glow">
            <ProjectMetrics />
          </div>

          {/* Main Content Grid */}
          <div className="cyber-grid">
            <div className="cyber-card p-6 hover-glow">
              <TimesheetTracker />
            </div>

            <div className="cyber-card p-6 hover-glow">
              <RecentActivity />
            </div>

            <div className="cyber-card p-6 hover-glow">
              <RemindersWidget />
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    </>
  );
};

export default Dashboard;
