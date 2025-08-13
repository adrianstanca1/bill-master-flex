
import React from 'react';
import { InvoiceDashboard } from '@/components/InvoiceDashboard';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import SEO from '@/components/SEO';

export default function Invoices() {
  return (
    <div className="min-h-screen bg-background">
      <ResponsiveLayout>
        <SEO 
          title="Invoices | UK Construction" 
          description="Comprehensive invoice management for your construction business - create, track, and send professional invoices"
        />
        <InvoiceDashboard />
      </ResponsiveLayout>
    </div>
  );
}
