import React from 'react';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { ClientManager } from '@/components/ClientManager';
import SEO from '@/components/SEO';

export default function CRM() {
  return (
    <div className="min-h-screen bg-background">
      <ResponsiveLayout>
        <SEO 
          title="CRM | AS PRO" 
          description="Customer relationship management for your construction business - manage clients, track communications, and build relationships"
        />
        <ClientManager />
      </ResponsiveLayout>
    </div>
  );
}