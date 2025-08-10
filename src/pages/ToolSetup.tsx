import React, { useEffect } from "react";
import FunctionDiagnostics from "@/components/FunctionDiagnostics";
import { Link } from "react-router-dom";

export default function ToolSetup() {
  useEffect(() => {
    document.title = "Tool Setup | Important information";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Important setup info for AI tools and edge functions.");
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Important setup info for AI tools and edge functions.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <main className="container mx-auto grid gap-6 animate-fade-in">
      <header className="pt-6">
        <h1 className="text-2xl font-bold">Important information for tool setup</h1>
        <p className="text-text-secondary">Configure required API keys and settings for each function.</p>
      </header>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">AI Functions requiring OpenAI</h2>
        <p className="text-sm text-text-secondary mb-2">agent, advisor, quote-bot, tax-bot, rams</p>
        <ul className="text-sm text-text-secondary list-disc pl-5 space-y-1">
          <li>Requires a valid OPENAI_API_KEY stored as a Supabase Secret.</li>
          <li>Sign in before invoking these functions.</li>
          <li>
            Get a key: <a className="link" href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">OpenAI API Keys</a>
          </li>
          <li>
            Check logs: <a className="link" href={`https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/functions/agent/logs`} target="_blank" rel="noreferrer">Agent Logs</a>
            {" • "}
            <a className="link" href={`https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/functions/advisor/logs`} target="_blank" rel="noreferrer">Advisor Logs</a>
            {" • "}
            <a className="link" href={`https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/functions/rams/logs`} target="_blank" rel="noreferrer">RAMS Logs</a>
          </li>
        </ul>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">TenderBot (Firecrawl)</h2>
        <ul className="text-sm text-text-secondary list-disc pl-5 space-y-1">
          <li>Requires FIRECRAWL_API_KEY stored as a Supabase Secret.</li>
          <li>Ensure the URL is https and within allowed scope.</li>
          <li>
            Learn more: <a className="link" href="https://www.firecrawl.dev/" target="_blank" rel="noreferrer">Firecrawl</a>
          </li>
          <li>
            Check logs: <a className="link" href={`https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/functions/tenderbot/logs`} target="_blank" rel="noreferrer">TenderBot Logs</a>
          </li>
        </ul>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Tender Search</h2>
        <ul className="text-sm text-text-secondary list-disc pl-5 space-y-1">
          <li>No API keys required. Returns curated search links to tender portals.</li>
        </ul>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">SmartOps</h2>
        <ul className="text-sm text-text-secondary list-disc pl-5 space-y-1">
          <li>Enter your Company ID in <Link className="link" to="/settings">Settings</Link>.</li>
          <li>Requires you to be signed in. Data access is protected via RLS.</li>
          <li>
            Check logs: <a className="link" href={`https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/functions/smartops/logs`} target="_blank" rel="noreferrer">SmartOps Logs</a>
          </li>
        </ul>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Quick Diagnostics</h2>
        <p className="text-sm text-text-secondary mb-3">Run all health checks. Failed items will include suggested fixes.</p>
        <FunctionDiagnostics />
      </section>
    </main>
  );
}
