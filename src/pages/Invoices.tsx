import React from "react";
import { InvoiceGenerator } from "@/components/InvoiceGenerator";
import SEO from "@/components/SEO";

const Invoices = () => {

  return (
    <main>
      <SEO title="Invoice Generator | UK Construction" description="Create professional invoices with VAT/CIS, retentions, discounts and more." />
      <h1 className="sr-only">Invoice Generator</h1>
      <InvoiceGenerator />
    </main>
  );
};

export default Invoices;
