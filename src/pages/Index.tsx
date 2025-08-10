import React, { useEffect } from "react";
import AgentChat from "@/components/AgentChat";
import SmartOpsPanel from "@/components/SmartOpsPanel";
import { Link } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    document.title = "UK Construction Business Dashboard";
    const desc = "Homepage dashboard with AI coaches for pricing, tenders, VAT/CIS and admin.";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", desc);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = desc;
      document.head.appendChild(meta);
    }
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (link) link.href = window.location.href;
    else {
      const l = document.createElement("link");
      l.rel = "canonical";
      l.href = window.location.href;
      document.head.appendChild(l);
    }
  }, []);

  return (
    <>
      <header className="container mx-auto py-8">
        <h1 className="text-3xl font-bold tracking-tight">UK Construction Business Dashboard</h1>
        <p className="mt-2 text-text-secondary max-w-3xl">
          Your all‑in‑one home for invoicing, pricing suggestions, tender discovery, VAT/CIS advice,
          and admin automation. Powered by on‑device AI agents to save you time and money.
        </p>
        <nav className="mt-4 flex gap-3">
          <Link to="/dashboard" className="button">Open Operations Dashboard</Link>
        </nav>
      </header>

      <main className="container mx-auto grid gap-8 pb-12">
        <section className="card">
          <h2 className="text-xl font-semibold mb-3">AI Coaches</h2>
          <p className="text-sm text-text-secondary mb-4">
            Ask anything about pricing, cash flow, client emails, compliance or growth. The input box uses improved contrast for readability.
          </p>
          <AgentChat />
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold mb-3">SmartOps Panel</h2>
          <p className="text-sm text-text-secondary mb-4">Scan your business, find tenders, generate quotes and get tax advice (UK construction).</p>
          <SmartOpsPanel />
        </section>

        <aside className="card">
          <h2 className="text-xl font-semibold mb-3">Quick tips</h2>
          <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1">
            <li>Use Quote tab for fast, margin‑aware estimates.</li>
            <li>Search tenders by industry and country; save promising ones.</li>
            <li>Draft payment reminders or client emails in AI Coaches.</li>
          </ul>
        </aside>
      </main>
    </>
  );
};

export default Index;
