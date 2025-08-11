
import React from 'react';
import { ImprovedDashboardOverview } from '@/components/ImprovedDashboardOverview';
import SEO from '@/components/SEO';

export default function Dashboard() {
  return (
    <>
      <SEO 
        title="Construction Business Dashboard | Real-time Analytics & Management"
        description="Comprehensive construction business dashboard with real-time analytics, project tracking, invoice management, and AI-powered insights for optimal business performance."
        keywords="construction dashboard, business analytics, project management, invoice tracking, construction CRM"
        openGraph={{
          title: "Professional Construction Business Dashboard",
          description: "Monitor your construction business performance with real-time analytics, project tracking, and intelligent insights.",
          type: "website"
        }}
      />
      
      <div className="min-h-screen bg-background">
        <ImprovedDashboardOverview />
      </div>
    </>
  );
}
