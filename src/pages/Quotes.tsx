
import React, { useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { FloatingElements } from "@/components/EnhancedVisualEffects";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Quote {
  id: string;
  company_id: string;
  title: string;
  items: any[];
  total: number;
  status: string;
  created_at: string;
}

const Quotes: React.FC = () => {
  const { toast } = useToast();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: companies } = await supabase.from("companies").select("id, name").order("created_at", { ascending: true });
      const id = companies?.[0]?.id || null;
      setCompanyId(id);
    };
    init();
  }, []);

  const loadQuotes = async (company: string) => {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("company_id", company)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load quotes", description: error.message, variant: "destructive" });
    } else {
      setQuotes(data as Quote[]);
    }
  };

  useEffect(() => {
    if (companyId) loadQuotes(companyId);
  }, [companyId]);

  const addQuote = async () => {
    if (!companyId || !newTitle.trim()) return;
    const { error } = await supabase.from("quotes").insert({
      company_id: companyId,
      title: newTitle.trim(),
      items: [],
      total: 0,
      status: "draft",
    });
    if (error) return toast({ title: "Could not create quote", description: error.message, variant: "destructive" });
    setNewTitle("");
    toast({ title: "Quote created" });
    await loadQuotes(companyId);
  };

  const convertToInvoice = async (q: Quote) => {
    const number = window.prompt("Invoice number? (e.g. INV-1001)") || undefined;
    const dueDate = window.prompt("Invoice due date (YYYY-MM-DD)?") || undefined;
    const client = window.prompt("Client name (optional)") || undefined;
    try {
      const { data, error } = await supabase.functions.invoke("quotes", {
        body: { quoteId: q.id, number, dueDate, client },
      });
      if (error) throw new Error(error.message);
      toast({ title: "Converted to invoice", description: data?.invoice?.number || "Invoice created" });
    } catch (e: any) {
      toast({ title: "Conversion failed", description: e.message || String(e), variant: "destructive" });
    }
  };

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Quotes",
    description: "Create quotes and convert them to invoices",
  }), []);

  return (
    <div className="page-enter">
      <FloatingElements>
        <ResponsiveLayout>
          <SEO title="Quotes | UK Construction" description="Create quotes and convert them to invoices." jsonLd={jsonLd} />
          <div className="dashboard-header animate-slide-in-right">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-shimmer-text">Quotes</h1>
            <p className="text-text-muted animate-fade-in">Create quotes and convert them to invoices.</p>
          </div>
          <Card className="widget-flash">
            <CardHeader>
              <CardTitle>Quotes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input className="input-flash" placeholder="Quote title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                <Button className="button-flash animate-button-press" onClick={addQuote} disabled={!companyId}>New Quote</Button>
              </div>
              <ul className="space-y-2">
                {quotes.map((q) => (
                  <li key={q.id} className="form-widget p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{q.title}</div>
                      <div className="text-sm text-muted-foreground">Total £{q.total?.toFixed(2) ?? "0.00"} • {new Date(q.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="animate-button-press" onClick={() => convertToInvoice(q)}>Convert to Invoice</Button>
                    </div>
                  </li>
                ))}
                {quotes.length === 0 && <div className="text-sm text-muted-foreground">No quotes yet.</div>}
              </ul>
            </CardContent>
          </Card>
        </ResponsiveLayout>
      </FloatingElements>
    </div>
  );
};

export default Quotes;
