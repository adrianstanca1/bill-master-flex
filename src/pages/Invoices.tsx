
import React from 'react';
import { InvoiceManager } from '@/components/InvoiceManager';
import SEO from '@/components/SEO';

export default function Invoices() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="Invoices" 
        description="Manage your construction business invoices - create, track, and send invoices"
      />
      
      <InvoiceManager />
    </div>
  );
}
