import React from "react";
import { AdvisorAgent } from "@/components/AdvisorAgent";
import SEO from "@/components/SEO";

const Advisor: React.FC = () => {

  return (
    <div>
      <SEO title="Business Advisor – Civix" description="AI advisor that audits, advises, and improves your operations." />
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
