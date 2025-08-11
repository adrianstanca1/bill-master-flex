
import React from 'react';
import { InvoiceManager } from '@/components/InvoiceManager';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import SEO from '@/components/SEO';

export default function Invoices() {
  return (
    <ResponsiveLayout>
      <SEO 
        title="Invoices" 
        description="Manage your construction business invoices - create, track, and send invoices"
      />
      
      <InvoiceManager />
    </ResponsiveLayout>
  );
}
