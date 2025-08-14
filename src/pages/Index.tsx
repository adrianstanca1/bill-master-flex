
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
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold text-gradient mb-6 animate-glow">
            AS PRO
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Next-generation construction management platform powered by AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <button className="btn-neon">
                Enter Dashboard
              </button>
            </Link>
            <Link to="/agents">
              <button className="glass-card px-6 py-3 hover-glow">
                AI Agents
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 space-y-12">
        <GuestBanner />
        
        {/* Features Grid */}
        <section className="cyber-grid">
          <div className="glass-card p-8 text-center hover-lift">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse-glow">
              <span className="text-2xl">🏗️</span>
            </div>
            <h3 className="text-xl font-semibold text-gradient mb-3">Project Management</h3>
            <p className="text-muted-foreground">
              Advanced project tracking with real-time updates and team collaboration tools
            </p>
          </div>

          <div className="glass-card p-8 text-center hover-lift">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-secondary flex items-center justify-center animate-pulse-glow">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold text-gradient-secondary mb-3">Financial Control</h3>
            <p className="text-muted-foreground">
              Professional invoicing, quotes, variations, and comprehensive financial tracking
            </p>
          </div>

          <div className="glass-card p-8 text-center hover-lift">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse-glow">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold text-gradient mb-3">AI Intelligence</h3>
            <p className="text-muted-foreground">
              Smart business intelligence, automated advisors, and AI agents
            </p>
          </div>
        </section>

        {/* Main Sections */}
        <div className="cyber-grid lg:grid-cols-2">
          <div className="cyber-card p-8 hover-glow">
            <h2 className="text-2xl font-semibold text-gradient mb-4">AI Business Coach</h2>
            <p className="text-muted-foreground mb-6">
              Get instant advice on pricing, cash flow, compliance, and business growth. Our AI understands UK construction industry specifics.
            </p>
            <div className="glass-card p-4">
              <AgentChat />
            </div>
          </div>

          <div className="cyber-card p-8 hover-glow">
            <h2 className="text-2xl font-semibold text-gradient mb-4">SmartOps Control Center</h2>
            <p className="text-muted-foreground mb-6">
              Automated business scanning, tender discovery, quote generation, and regulatory compliance management.
            </p>
            <div className="glass-card p-4">
              <SmartOpsPanel />
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <section className="cyber-card p-8 hover-glow">
          <h2 className="text-2xl font-semibold text-gradient mb-6">Quick Access</h2>
          <div className="cyber-grid sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/invoices" className="glass-card p-6 hover-lift text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-semibold mb-1">Invoices</div>
              <div className="text-xs text-muted-foreground">Create & manage</div>
            </Link>
            <Link to="/projects" className="glass-card p-6 hover-lift text-center">
              <div className="text-2xl mb-2">🏗️</div>
              <div className="font-semibold mb-1">Projects</div>
              <div className="text-xs text-muted-foreground">Track progress</div>
            </Link>
            <Link to="/crm" className="glass-card p-6 hover-lift text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold mb-1">Clients</div>
              <div className="text-xs text-muted-foreground">Manage relationships</div>
            </Link>
            <Link to="/hr" className="glass-card p-6 hover-lift text-center">
              <div className="text-2xl mb-2">👨‍💼</div>
              <div className="font-semibold mb-1">Team</div>
              <div className="text-xs text-muted-foreground">HR management</div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
