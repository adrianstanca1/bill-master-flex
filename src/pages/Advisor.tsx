import React, { useEffect } from "react";
import { AdvisorAgent } from "@/components/AdvisorAgent";

const Advisor: React.FC = () => {
  useEffect(() => {
    document.title = "Business Advisor – Civix";
    const desc = "AI advisor that audits, advises, and improves your operations.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    const canonicalHref = window.location.origin + "/advisor";
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalHref);
  }, []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Business Advisor & Supervisor</h1>
        <p className="text-muted-foreground mt-1">Proactive insights across finance, tenders, scheduling, and compliance.</p>
      </header>
      <main>
        <section aria-labelledby="advisor-section" className="grid gap-4">
          <h2 id="advisor-section" className="sr-only">Advisor Chat</h2>
          <AdvisorAgent />
        </section>
      </main>
    </div>
  );
};

export default Advisor;
