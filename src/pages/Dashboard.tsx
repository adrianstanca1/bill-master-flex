
import React from 'react';
import { DashboardOverview } from '@/components/DashboardOverview';
import SEO from '@/components/SEO';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="Dashboard" 
        description="Your construction business dashboard - track invoices, projects, and performance"
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business performance.
        </p>
      </div>

      <DashboardOverview />
    </div>
  );
}
