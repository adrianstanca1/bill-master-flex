import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function TenderBot() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"crawl" | "scrape">("crawl");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleRun() {
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("tenderbot", {
        body: { url, mode, limit: 50 },
      });
      if (error) throw error;
      setResult(data);
    } catch (e) {
      console.error(e);
      setResult({ error: "Failed to run TenderBot" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="grid md:grid-cols-5 gap-2">
        <input
          className="input md:col-span-3"
          placeholder="https://example.com/tenders"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <select className="input" value={mode} onChange={(e) => setMode(e.target.value as any)}>
          <option value="crawl">Crawl (site-wide)</option>
          <option value="scrape">Scrape (single page)</option>
        </select>
        <button className="button" onClick={handleRun} disabled={loading}>
          {loading ? "Running…" : "Run TenderBot"}
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
