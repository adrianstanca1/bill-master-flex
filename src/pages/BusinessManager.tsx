import React from "react";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import CISCalculator from "@/components/CISCalculator";

const BusinessManager = () => {
  return (
    <main className="container mx-auto py-6">
      <SEO
        title="Business Manager | Operations Hub"
        description="Manage reminders, RAMS, photos, dayworks, timesheets, quotes, invoices, and more."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Business Manager",
          applicationCategory: "BusinessApplication",
        }}
        canonical={(typeof window !== "undefined" ? window.location.origin : "") + "/business-manager"}
      />
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Business Manager</h1>
        <p className="text-text-secondary">Central hub for site operations and admin tasks.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-3">Create invoices with VAT, retention, and CIS.</p>
            <Link to="/invoices" className="button">Open</Link>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle>Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-3">Convert quotes to invoices and track totals.</p>
            <Link to="/quotes" className="button">Open</Link>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle>CRM</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-3">Manage clients and project contacts.</p>
            <Link to="/crm" className="button">Open</Link>
          </CardContent>
        </Card>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle>Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">Schedule payment and task reminders. (Coming soon)</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle>RAMS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">Generate method statements and risk assessments. (Coming soon)</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">Capture site photos and attach to jobs. (Coming soon)</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle>Dayworks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">Track daywork items and prices. (Coming soon)</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle>Timesheets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">Record hours and allocate to jobs. (Coming soon)</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle>Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">Discover and track tender opportunities.</p>
            <Link to="/dashboard#tenders" className="button">Open</Link>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle>CIS Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <CISCalculator />
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default BusinessManager;
