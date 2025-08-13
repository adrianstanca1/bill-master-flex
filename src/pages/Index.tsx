
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
        title="UK Construction Business Dashboard"
        description="AI-powered dashboard for invoicing, tenders, quotes, and VAT/CIS."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "UK Construction Business Dashboard",
          potentialAction: {
            "@type": "SearchAction",
            target: (typeof window !== "undefined" ? window.location.origin : "") + "/dashboard#invoices?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      
      <div className="container mx-auto py-8">
        <GuestBanner />
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">UK Construction Business Dashboard</h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Your all‑in‑one home for invoicing, pricing suggestions, tender discovery, VAT/CIS advice,
            and admin automation. Powered by AI agents to save you time and money.
          </p>
          <nav className="mt-4 flex gap-3">
            <Button asChild>
              <Link to="/dashboard">Open Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/invoices">Open Invoice Generator</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          </nav>
        </header>

        <main className="grid gap-8 pb-12">
          <section className="card">
            <h2 className="text-xl font-semibold mb-3">AI Coaches</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Ask anything about pricing, cash flow, client emails, compliance or growth. The input box uses improved contrast for readability.
            </p>
            <AgentChat />
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-3">SmartOps Panel</h2>
            <p className="text-sm text-muted-foreground mb-4">Scan your business, find tenders, generate quotes and get tax advice (UK construction).</p>
            <SmartOpsPanel />
          </section>

          <aside className="card">
            <h2 className="text-xl font-semibold mb-3">Quick tips</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Use Quote tab for fast, margin‑aware estimates.</li>
              <li>Search tenders by industry and country; save promising ones.</li>
              <li>Draft payment reminders or client emails in AI Coaches.</li>
            </ul>
          </aside>
        </main>
      </div>
    </>
  );
};

export default Index;
