
import React from 'react';
import { InvoiceManager } from '@/components/InvoiceManager';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import SEO from '@/components/SEO';
import { TopNavigation } from '@/components/TopNavigation';

export default function Invoices() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <ResponsiveLayout>
        <SEO 
          title="Invoices" 
          description="Manage your construction business invoices - create, track, and send invoices"
        />
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Invoice Management</h1>
          <p className="text-muted-foreground">
            Create, manage and track your invoices with our interactive dashboard
          </p>
        </div>
        <div className="widget-container">
          <InvoiceManager />
        </div>
      </ResponsiveLayout>
    </div>
  );
}
