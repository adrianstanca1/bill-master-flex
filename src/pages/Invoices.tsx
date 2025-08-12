
import React from 'react';
import { InvoiceManager } from '@/components/InvoiceManager';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { FloatingElements } from '@/components/EnhancedVisualEffects';
import SEO from '@/components/SEO';

export default function Invoices() {
  return (
    <div className="page-enter">
      <FloatingElements>
        <ResponsiveLayout>
          <SEO 
            title="Invoices" 
            description="Manage your construction business invoices - create, track, and send invoices"
          />
          
          <div className="dashboard-header animate-slide-in-right">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-shimmer-text">
              Invoice Management
            </h1>
            <p className="text-text-muted animate-fade-in">
              Create, manage and track your invoices with our interactive dashboard
            </p>
          </div>
          
          <div className="widget-container">
            <InvoiceManager />
          </div>
        </ResponsiveLayout>
      </FloatingElements>
    </div>
  );
}
