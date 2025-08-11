
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompanyId } from "@/hooks/useCompanyId";
import { useToast } from "@/hooks/use-toast";

export default function SmartOpsPanel() {
  return (
    <div className="grid gap-4">
      <Tabs defaultValue="scan">
        <TabsList className="mb-2">
          <TabsTrigger value="scan">Scan</TabsTrigger>
          <TabsTrigger value="tenders">Tenders</TabsTrigger>
          <TabsTrigger value="quote">Quote</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
        </TabsList>

        <TabsContent value="scan"><ScanTab /></TabsContent>
        <TabsContent value="tenders"><TenderSearchTab /></TabsContent>
        <TabsContent value="quote"><QuoteTab /></TabsContent>
        <TabsContent value="tax"><TaxTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function ScanTab() {
  const companyId = useCompanyId();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  async function runScan() {
    if (!companyId) {
      toast({
        title: "Missing Company ID",
        description: "Please set up your company profile first.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("smartops", { 
        body: { companyId } 
      });
      if (error) throw error;
      setResult(data);
      toast({
        title: "Scan Complete",
        description: "SmartOps scan completed successfully"
      });
    } catch (e: any) {
      console.error("SmartOps scan error:", e);
      const errorMsg = e?.message?.includes("JWT") ? "Please sign in to use SmartOps" : "Failed to run SmartOps scan";
      setResult({ error: errorMsg });
      toast({
        title: "Scan Failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="grid md:grid-cols-3 gap-2">
        <div className="input bg-gray-100 text-gray-600">
          Company ID: {companyId ? companyId.slice(0, 8) + "..." : "Not set"}
        </div>
        <button className="button" onClick={runScan} disabled={loading || !companyId}>
          {loading ? "Scanning…" : "Run Scan"}
        </button>
      </div>
      {result && (
        <div className="bg-gray-900 rounded-md p-3 overflow-auto">
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function TenderSearchTab() {
  const [query, setQuery] = useState("construction");
  const [country, setCountry] = useState("UK");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [govLoading, setGovLoading] = useState(false);
  const [govResults, setGovResults] = useState<any>(null);
  const { toast } = useToast();

  async function search() {
    if (!query.trim()) {
      toast({
        title: "Missing Query",
        description: "Please enter a search query",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("tender-search", { 
        body: { query, country, industry: "construction" } 
      });
      if (error) throw error;
      setResults(data);
    } catch (e: any) {
      console.error("Tender search error:", e);
      setResults({ error: "Failed to search tenders" });
      toast({
        title: "Search Failed",
        description: "Failed to search for tenders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function searchGov() {
    if (!query.trim()) {
      toast({
        title: "Missing Query",
        description: "Please enter a search query",
        variant: "destructive"
      });
      return;
    }
    
    setGovLoading(true);
    setGovResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("tenders", { 
        body: { keyword: query, location: country } 
      });
      if (error) throw error;
      setGovResults(data);
    } catch (e: any) {
      console.error("Gov tender search error:", e);
      setGovResults({ error: "Failed to fetch UK tenders" });
      toast({
        title: "Gov Search Failed",
        description: "Failed to fetch government tenders",
        variant: "destructive"
      });
    } finally {
      setGovLoading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="grid md:grid-cols-5 gap-2">
        <input 
          className="input md:col-span-2" 
          placeholder="Search query" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
        <input 
          className="input" 
          placeholder="Country" 
          value={country} 
          onChange={(e) => setCountry(e.target.value)} 
        />
        <button className="button" onClick={search} disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
        <button className="button-secondary" onClick={searchGov} disabled={govLoading}>
          {govLoading ? "Fetching…" : "UK Gov Tenders"}
        </button>
      </div>
      
      {results?.results && (
        <div className="bg-gray-50 rounded-md p-3">
          <h4 className="font-semibold mb-2">Search Results:</h4>
          <ul className="text-sm list-disc pl-5 space-y-1">
            {results.results.map((r: any, i: number) => (
              <li key={i}>
                <a className="text-blue-600 hover:underline" href={r.url} target="_blank" rel="noreferrer">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {govResults && (
        <div className="bg-gray-900 rounded-md p-3 text-sm space-y-2">
          {govResults.summary && <div className="text-white whitespace-pre-wrap">{govResults.summary}</div>}
          {Array.isArray(govResults.rawTenders) && govResults.rawTenders.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-2">Government Tenders:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {govResults.rawTenders.map((t: any, i: number) => (
                  <li key={i}>
                    <a className="text-blue-400 hover:underline" href={t.url} target="_blank" rel="noreferrer">
                      {t.title}{t.deadline ? ` — ${t.deadline}` : ""}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QuoteTab() {
  const [title, setTitle] = useState("Small refurb job");
  const [withMaterials, setWithMaterials] = useState(true);
  const [margin, setMargin] = useState(20);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const { toast } = useToast();

  async function generate() {
    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a quote title",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setQuote(null);
    try {
      const { data, error } = await supabase.functions.invoke("quote-bot", { 
        body: { title, withMaterials, targetMargin: margin/100 } 
      });
      if (error) throw error;
      setQuote(data?.quote);
      toast({
        title: "Quote Generated",
        description: "Quote generated successfully"
      });
    } catch (e: any) {
      console.error("Quote generation error:", e);
      const errorMsg = e?.message?.includes("JWT") ? "Please sign in to generate quotes" : "Failed to generate quote";
      setQuote({ error: errorMsg });
      toast({
        title: "Generation Failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="grid md:grid-cols-4 gap-2">
        <input 
          className="input md:col-span-2" 
          placeholder="Quote title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <select 
          className="input" 
          value={withMaterials ? "yes" : "no"} 
          onChange={(e) => setWithMaterials(e.target.value === "yes")}
        > 
          <option value="yes">With materials</option>
          <option value="no">Labour only</option>
        </select>
        <input 
          className="input" 
          type="number" 
          min={0} 
          max={90} 
          value={margin} 
          onChange={(e) => setMargin(Number(e.target.value))} 
          placeholder="Margin %" 
        />
      </div>
      <button className="button w-fit" onClick={generate} disabled={loading || !title.trim()}>
        {loading ? "Generating…" : "Generate Quote"}
      </button>
      {quote && (
        <div className="bg-gray-900 rounded-md p-3 overflow-auto">
          <pre className="text-xs text-white whitespace-pre-wrap">{JSON.stringify(quote, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function TaxTab() {
  const [turnover, setTurnover] = useState(75000);
  const [scheme, setScheme] = useState("standard");
  const [reverseCharge, setReverseCharge] = useState(true);
  const [cis, setCis] = useState(true);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string>("");
  const { toast } = useToast();

  async function getAdvice() {
    setLoading(true);
    setAdvice("");
    try {
      const { data, error } = await supabase.functions.invoke("tax-bot", { 
        body: { turnover12m: turnover, vatScheme: scheme, reverseCharge, cis } 
      });
      if (error) throw error;
      setAdvice((data as any)?.advice || "No advice received");
      toast({
        title: "Advice Generated",
        description: "Tax advice generated successfully"
      });
    } catch (e: any) {
      console.error("Tax advice error:", e);
      const errorMsg = e?.message?.includes("JWT") ? "Please sign in to get tax advice" : "Failed to get tax advice";
      setAdvice(errorMsg);
      toast({
        title: "Advice Failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="grid md:grid-cols-5 gap-2">
        <input 
          className="input" 
          type="number" 
          step="1000" 
          placeholder="12m turnover (£)" 
          value={turnover} 
          onChange={(e) => setTurnover(Number(e.target.value))} 
        />
        <select className="input" value={scheme} onChange={(e) => setScheme(e.target.value)}>
          <option value="standard">Standard VAT</option>
          <option value="flat-rate">Flat-rate VAT</option>
          <option value="cash-accounting">Cash accounting</option>
        </select>
        <select 
          className="input" 
          value={reverseCharge ? "yes" : "no"} 
          onChange={(e) => setReverseCharge(e.target.value === "yes")}
        > 
          <option value="yes">Reverse charge: On</option>
          <option value="no">Reverse charge: Off</option>
        </select>
        <select 
          className="input" 
          value={cis ? "yes" : "no"} 
          onChange={(e) => setCis(e.target.value === "yes")}
        > 
          <option value="yes">CIS: On</option>
          <option value="no">CIS: Off</option>
        </select>
        <button className="button" onClick={getAdvice} disabled={loading}>
          {loading ? "Thinking…" : "Get Advice"}
        </button>
      </div>
      {advice && (
        <div className="bg-gray-50 rounded-md p-3 text-sm whitespace-pre-wrap border">
          {advice}
        </div>
      )}
    </div>
  );
}
