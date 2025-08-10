import React, { useEffect } from "react";
import { InvoiceGenerator } from "@/components/InvoiceGenerator";

const Invoices = () => {
  useEffect(() => {
    document.title = "Invoice Generator | UK Construction";
    const desc = "Create professional invoices with VAT/CIS, retentions, discounts and more.";
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
    <main>
      <h1 className="sr-only">Invoice Generator</h1>
      <InvoiceGenerator />
    </main>
  );
};

export default Invoices;
