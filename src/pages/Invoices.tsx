
import React from "react";
import { InvoiceGenerator } from "@/components/InvoiceGenerator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SEO from "@/components/SEO";

const Invoices = () => {
  return (
    <ErrorBoundary>
      <SEO title="Invoice Management | Professional Invoicing" description="Create, manage and track professional invoices with VAT, CIS, retention and payment tracking." />
      <h1 className="sr-only">Professional Invoice Management System</h1>
      <InvoiceGenerator />
    </ErrorBoundary>
  );
};

export default Invoices;
