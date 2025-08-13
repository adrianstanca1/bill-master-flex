
import React from "react";
import AgentChat from "@/components/AgentChat";
import SmartOpsPanel from "@/components/SmartOpsPanel";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { GuestBanner } from "@/components/GuestBanner";

const Index = () => {
  return (
    <>
      <SEO
        title="AS PRO Business Dashboard"
        description="AI-powered dashboard for invoicing, tenders, quotes, and VAT/CIS."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "AS PRO Business Dashboard",
          potentialAction: {
            "@type": "SearchAction",
            target: (typeof window !== "undefined" ? window.location.origin : "") + "/dashboard#invoices?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      
      {/* Hero Section */}
      <section className="hero-section py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            AS PRO
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Business Platform
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Your complete construction business management solution. Handle invoicing, project management, 
            team coordination, and AI-powered business intelligence all in one professional platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-3">
              <Link to="/dashboard">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3">
              <Link to="/business-manager">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4">
        <GuestBanner />
        
        {/* Features Grid */}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <div className="modern-card p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold ml-3">Project Management</h3>
            </div>
            <p className="text-muted-foreground">Complete project tracking with timesheets, progress monitoring, and team coordination.</p>
          </div>

          <div className="modern-card p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold ml-3">Financial Management</h3>
            </div>
            <p className="text-muted-foreground">Professional invoicing, quotes, variations, and comprehensive financial tracking.</p>
          </div>

          <div className="modern-card p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold ml-3">AI-Powered Tools</h3>
            </div>
            <p className="text-muted-foreground">Smart business intelligence, automated advisors, and AI agents to streamline operations.</p>
          </div>
        </section>

        {/* Main Sections */}
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="modern-card p-6">
            <h2 className="text-2xl font-semibold mb-4">AI Business Coach</h2>
            <p className="text-muted-foreground mb-6">
              Get instant advice on pricing, cash flow, compliance, and business growth. Our AI understands UK construction industry specifics.
            </p>
            <AgentChat />
          </section>

          <section className="modern-card p-6">
            <h2 className="text-2xl font-semibold mb-4">SmartOps Control Center</h2>
            <p className="text-muted-foreground mb-6">
              Automated business scanning, tender discovery, quote generation, and regulatory compliance management.
            </p>
            <SmartOpsPanel />
          </section>
        </div>

        {/* Quick Access */}
        <section className="modern-card p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" size="lg" asChild className="h-16 flex-col">
              <Link to="/invoices">
                <span className="text-sm font-semibold">Invoices</span>
                <span className="text-xs text-muted-foreground">Create & manage</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-16 flex-col">
              <Link to="/projects">
                <span className="text-sm font-semibold">Projects</span>
                <span className="text-xs text-muted-foreground">Track progress</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-16 flex-col">
              <Link to="/crm">
                <span className="text-sm font-semibold">Clients</span>
                <span className="text-xs text-muted-foreground">Manage relationships</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-16 flex-col">
              <Link to="/hr">
                <span className="text-sm font-semibold">Team</span>
                <span className="text-xs text-muted-foreground">HR management</span>
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
