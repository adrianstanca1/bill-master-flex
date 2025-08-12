import React, { useState } from "react";
import SEO from "@/components/SEO";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Widget, WidgetHeader, WidgetContent } from "@/components/ui/widget";
import { FloatingElements } from "@/components/EnhancedVisualEffects";

const Agents: React.FC = () => {
  const { toast } = useToast();

  // FundingBot
  const [fundKeywords, setFundKeywords] = useState("");
  const [fundLocation, setFundLocation] = useState("UK");
  const [fundResults, setFundResults] = useState<any[]>([]);
  const [loadingFunding, setLoadingFunding] = useState(false);

  // RiskBot
  const [riskInput, setRiskInput] = useState("");
  const [riskResults, setRiskResults] = useState<any[]>([]);
  const [loadingRisk, setLoadingRisk] = useState(false);

  // Bid Package
  const [tenderUrl, setTenderUrl] = useState("");
  const [companyNotes, setCompanyNotes] = useState("");
  const [bidResult, setBidResult] = useState<any | null>(null);
  const [loadingBid, setLoadingBid] = useState(false);

  const findFunding = async () => {
    if (!fundKeywords.trim()) return;
    setLoadingFunding(true);
    setFundResults([]);
    try {
      const { data, error } = await supabase.functions.invoke("funding-bot", {
        body: { keywords: fundKeywords, location: fundLocation }
      });
      if (error) throw new Error(error.message);
      setFundResults(data?.grants || []);
      toast({ title: "Funding suggestions ready", description: `${(data?.grants || []).length} results` });
    } catch (e: any) {
      toast({ title: "Failed to fetch funding", description: e.message || String(e), variant: "destructive" });
    } finally {
      setLoadingFunding(false);
    }
  };

  const analyzeRisk = async () => {
    if (!riskInput.trim()) return;
    setLoadingRisk(true);
    setRiskResults([]);
    try {
      const { data, error } = await supabase.functions.invoke("risk-bot", {
        body: { content: riskInput }
      });
      if (error) throw new Error(error.message);
      setRiskResults(data?.risks || []);
      toast({ title: "Risk analysis complete", description: `${(data?.risks || []).length} issues found` });
    } catch (e: any) {
      toast({ title: "Risk analysis failed", description: e.message || String(e), variant: "destructive" });
    } finally {
      setLoadingRisk(false);
    }
  };

  const generateBid = async () => {
    if (!tenderUrl.trim() && !companyNotes.trim()) return;
    setLoadingBid(true);
    setBidResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("bid-package", {
        body: { url: tenderUrl || undefined, details: companyNotes || undefined }
      });
      if (error) throw new Error(error.message);
      setBidResult(data || null);
      toast({ title: "Bid package generated" });
    } catch (e: any) {
      toast({ title: "Bid generation failed", description: e.message || String(e), variant: "destructive" });
    } finally {
      setLoadingBid(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Agents Hub",
    description: "Discover grants, assess risks, and generate bid packages with AI.",
  };

  return (
    <div className="page-enter">
      <FloatingElements>
        <ResponsiveLayout>
          <SEO title="AI Agents Hub | UK Construction" description="Discover grants, assess risks, and generate bid packages with AI." jsonLd={jsonLd} />
          <div className="dashboard-header animate-slide-in-right">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-shimmer-text">
              AI Agents Hub
            </h1>
            <p className="text-text-muted animate-fade-in">
              Discover grants, assess risks, and generate bid packages with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Widget variant="floating" animated>
              <WidgetHeader title="FundingBot" subtitle="Discover grants and funding opportunities" />
              <WidgetContent variant="padded">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input className="input-flash" placeholder="Keywords (e.g. retrofit, SME)" value={fundKeywords} onChange={(e) => setFundKeywords(e.target.value)} />
                    <Input className="input-flash" placeholder="Location" value={fundLocation} onChange={(e) => setFundLocation(e.target.value)} />
                    <Button className="button-flash animate-button-press" onClick={findFunding} disabled={loadingFunding}>
                      {loadingFunding ? "Searching..." : "Find Grants"}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {fundResults.map((g, idx) => (
                      <Card key={idx} className="widget-flash animate-widget-hover">
                        <CardHeader>
                          <CardTitle className="text-base">{g.title}</CardTitle>
                          {g.amount && <CardDescription>Up to {g.amount}</CardDescription>}
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          <div className="flex flex-wrap gap-2">
                            {g.deadline && <span>Deadline: {g.deadline}</span>}
                            {g.relevance && <span>Relevance: {g.relevance}/100</span>}
                          </div>
                          {g.url && (
                            <a className="story-link mt-2 inline-block" href={g.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${g.title}`}>
                              View details ↗
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {fundResults.length === 0 && <p className="text-sm text-muted-foreground">No results yet. Try a search.</p>}
                  </div>
                </div>
              </WidgetContent>
            </Widget>

            <Widget variant="glass" animated>
              <WidgetHeader title="RiskBot" subtitle="Analyze text for compliance and financial risks" />
              <WidgetContent variant="padded">
                <div className="space-y-3">
                  <Textarea className="input-flash" rows={6} placeholder="Paste a quote, invoice, or project notes to analyze risks" value={riskInput} onChange={(e) => setRiskInput(e.target.value)} />
                  <div className="flex justify-end">
                    <Button className="button-flash animate-button-press" onClick={analyzeRisk} disabled={loadingRisk}>{loadingRisk ? "Analyzing..." : "Analyze"}</Button>
                  </div>
                  <ul className="space-y-2">
                    {riskResults.map((r, idx) => (
                      <li key={idx} className="form-widget p-3">
                        <div className="font-medium">{r.title || r.issue}</div>
                        <div className="text-sm text-muted-foreground">Severity: {r.severity || r.score}</div>
                        {r.recommendation && <div className="text-sm mt-1">Action: {r.recommendation}</div>}
                      </li>
                    ))}
                    {riskResults.length === 0 && <p className="text-sm text-muted-foreground">No analysis yet.</p>}
                  </ul>
                </div>
              </WidgetContent>
            </Widget>

            <Widget variant="neon" animated>
              <WidgetHeader title="Bid Package Generator" subtitle="Assemble cover letter, checklist, and summaries" />
              <WidgetContent variant="padded">
                <div className="space-y-3">
                  <Input className="input-flash" placeholder="Tender URL (optional)" value={tenderUrl} onChange={(e) => setTenderUrl(e.target.value)} />
                  <Textarea className="input-flash" rows={4} placeholder="Company strengths or requirements (optional)" value={companyNotes} onChange={(e) => setCompanyNotes(e.target.value)} />
                  <div className="flex justify-end">
                    <Button className="button-flash animate-button-press" onClick={generateBid} disabled={loadingBid}>{loadingBid ? "Generating..." : "Generate"}</Button>
                  </div>

                  {bidResult && (
                    <div className="space-y-4">
                      {bidResult.cover_letter && (
                        <Card className="widget-flash">
                          <CardHeader><CardTitle>Cover Letter</CardTitle></CardHeader>
                          <CardContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                            {bidResult.cover_letter}
                          </CardContent>
                        </Card>
                      )}
                      {bidResult.compliance_checklist && (
                        <Card className="widget-flash">
                          <CardHeader><CardTitle>Compliance Checklist</CardTitle></CardHeader>
                          <CardContent>
                            <ul className="list-disc pl-5 space-y-1">
                              {bidResult.compliance_checklist.map((c: string, i: number) => <li key={i}>{c}</li>)}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                      {bidResult.summary && (
                        <Card className="widget-flash">
                          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                          <CardContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                            {bidResult.summary}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              </WidgetContent>
            </Widget>

            <Card className="widget-flash">
              <CardHeader>
                <CardTitle>Procurement Manager</CardTitle>
                <CardDescription>Track materials, requests, and supplier notes (basic)</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>This is a lightweight UI placeholder. We can wire this to your database when ready.</p>
              </CardContent>
            </Card>
          </div>
        </ResponsiveLayout>
      </FloatingElements>
    </div>
  );
};

export default Agents;
