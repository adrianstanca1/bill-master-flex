
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
        title="Dashboard | UK Construction" 
        description="Your construction business dashboard with real-time metrics, project tracking, and team management tools."
      />
      <ResponsiveLayout>
        <div className="space-y-6">
          <GuestBanner />
          
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your construction business performance and activities
            </p>
          </div>

          {/* Quick Stats */}
          <QuickStatsGrid />

          {/* Project Metrics */}
          <ProjectMetrics />

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Timesheet Tracker */}
            <div className="lg:col-span-1">
              <TimesheetTracker />
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <RecentActivity />
            </div>

            {/* Reminders */}
            <div className="lg:col-span-1">
              <RemindersWidget />
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    </>
  );
};

export default Dashboard;
