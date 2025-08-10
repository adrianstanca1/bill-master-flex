import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

 type Result = { name: string; status: "OK" | "FAIL" | "SKIP"; detail?: string };

export default function FunctionDiagnostics() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);

  async function run() {
    setLoading(true);
    setResults(null);
    const settings = (() => { try { return JSON.parse(localStorage.getItem("as-settings")||"{}"); } catch { return {}; } })();
    const companyId = settings?.companyId || "";

    async function call(name: string, fn: () => Promise<any>): Promise<Result> {
      try {
        const { data, error } = await fn();
        if (error) throw error;
        return { name, status: "OK", detail: JSON.stringify(data).slice(0, 180) };
      } catch (e: any) {
        return { name, status: "FAIL", detail: e?.message || "error" };
      }
    }

    const tasks: Promise<Result>[] = [
      call("agent", () => supabase.functions.invoke("agent", { body: { message: "Health check", invoices: [] } })),
      call("quote-bot", () => supabase.functions.invoke("quote-bot", { body: { title: "Test", withMaterials: true, targetMargin: 0.2 } })),
      call("tax-bot", () => supabase.functions.invoke("tax-bot", { body: { turnover12m: 10000, vatScheme: "standard", reverseCharge: true, cis: true } })),
      call("tender-search", () => supabase.functions.invoke("tender-search", { body: { query: "roofing", country: settings?.country || "UK", industry: settings?.industry || "construction" } })),
      call("rams", () => supabase.functions.invoke("rams", { body: { project: { name: "Health Check", location: "London", date: "2025-01-01", description: "Test", tasks: ["Setup"] } } })),
      call("tenderbot", () => supabase.functions.invoke("tenderbot", { body: { url: "https://example.com", mode: "scrape", limit: 5 } })),
      companyId ? call("smartops", () => supabase.functions.invoke("smartops", { body: { companyId } })) : Promise.resolve({ name: "smartops", status: "SKIP", detail: "No companyId in Settings" }),
    ];

    const res = await Promise.all(tasks);
    setResults(res);
    setLoading(false);
  }

  return (
    <div className="grid gap-2">
      <button className="button w-fit" onClick={run} disabled={loading}>
        {loading ? "Running diagnostics…" : "Run Diagnostics"}
      </button>
      {results && (
        <div className="bg-gray-900 rounded-md p-3 overflow-auto">
          <table className="table text-sm">
            <thead>
              <tr><th>Function</th><th>Status</th><th>Detail</th></tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td className={r.status === "OK" ? "text-emerald-400" : r.status === "SKIP" ? "text-gray-400" : "text-red-400"}>{r.status}</td>
                  <td className="break-all">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
