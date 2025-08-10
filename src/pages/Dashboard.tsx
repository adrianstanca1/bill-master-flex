import React, { useEffect, useMemo, useState, useRef } from "react";
import AgentChat from "@/components/AgentChat";
import TenderBot from "@/components/TenderBot";
import RamsGenerator from "@/components/RamsGenerator";
import SmartOpsPanel from "@/components/SmartOpsPanel";
import FunctionDiagnostics from "@/components/FunctionDiagnostics";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SEO from "@/components/SEO";

type InvoiceRow = {
  number: string;
  client: string;
  total: number;
  dueDate?: string; // yyyy-mm-dd
  status: "draft" | "sent" | "paid" | "overdue";
};

const LS_KEY = "as-invoices";

function readInvoices(): InvoiceRow[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeInvoices(rows: InvoiceRow[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(rows));
}

function isOverdue(inv: InvoiceRow): boolean {
  if (inv.status === "paid") return false;
  if (!inv.dueDate) return false;
  const today = new Date();
  const due = new Date(inv.dueDate);
  return (
    due.getTime() <
    new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  );
}

export default function Dashboard() {
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [newRow, setNewRow] = useState<InvoiceRow>({
    number: "",
    client: "",
    total: 0,
    dueDate: "",
    status: "sent",
  });

  const [filter, setFilter] = useState<string>("");
  const numberInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const data: InvoiceRow[] = readInvoices();
    const updated: InvoiceRow[] = data.map((r) => ({
      ...r,
      status: (isOverdue(r) && r.status !== "paid" ? "overdue" : r.status) as InvoiceRow["status"],
    }));
    setRows(updated);
    writeInvoices(updated);
  }, []);

  const kpi = useMemo(() => {
    const outstanding = rows
      .filter((r) => r.status !== "paid")
      .reduce((s, r) => s + (r.total || 0), 0);
    const overdueList = rows.filter((r) => r.status === "overdue");
    const overdue = overdueList.reduce((s, r) => s + (r.total || 0), 0);
    const nextDue = rows
      .filter((r) => r.status !== "paid" && r.dueDate)
      .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))[0];
    return { outstanding, overdue, overdueCount: overdueList.length, nextDue };
  }, [rows]);

  const filteredRows = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => [r.number, r.client, r.status, r.dueDate || "", String(r.total)]
      .some((v) => String(v).toLowerCase().includes(term)));
  }, [rows, filter]);

  function addRow() {
    if (!newRow.number || !newRow.client)
      return alert("Invoice number and client required.");
    const r = { ...newRow, total: Number(newRow.total || 0) };
    const updated = [...rows, r];
    setRows(updated);
    writeInvoices(updated);
    setNewRow({ number: "", client: "", total: 0, dueDate: "", status: "sent" });
  }
  function removeRow(idx: number) {
    const updated = rows.slice(0, idx).concat(rows.slice(idx + 1));
    setRows(updated);
    writeInvoices(updated);
  }
  function markPaid(idx: number) {
    const updated: InvoiceRow[] = rows.map((r, i) =>
      i === idx ? { ...r, status: "paid" as InvoiceRow["status"] } : r
    );
    setRows(updated);
    writeInvoices(updated);
  }

  const defaultTab = (() => {
    if (typeof window === "undefined") return "overview";
    const h = window.location.hash.replace('#', '');
    const allowed = new Set(["overview", "invoices", "ai", "smartops", "tenders", "rams", "diag"]);
    return allowed.has(h) ? h : "overview";
  })();

  const [tab, setTab] = useState(defaultTab);

  // Sync filter with ?q= and focus INV when landing on #invoices
  useEffect(() => {
    const setFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      setFilter(params.get("q") || "");
    };
    setFromURL();

    const onPop = () => setFromURL();
    const onHash = () => {
      if (window.location.hash.replace('#','') === 'invoices') {
        numberInputRef.current?.focus();
      }
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => {
    if (defaultTab === 'invoices') {
      numberInputRef.current?.focus();
    }
  }, [defaultTab]);

  return (
    <>
      <SEO
        title="Dashboard | AS Invoice Generator"
        description="Invoice dashboard with KPIs and AI tools for UK construction."
      />
      <main className="grid gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">Business Dashboard</h1>
          <div className="flex flex-wrap gap-2">
            <button
              className="button button-sm sm:!px-4 sm:!py-2"
              onClick={() => {
                setTab('invoices');
                window.location.hash = 'invoices';
                setTimeout(() => {
                  numberInputRef.current?.focus();
                  numberInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 0);
              }}
            >
              New Invoice
            </button>
            <button
              className="button-secondary button-secondary-sm sm:!px-4 sm:!py-2"
              onClick={() => {
                localStorage.removeItem(LS_KEY);
                setRows([]);
              }}
            >
              Clear All
            </button>
          </div>
        </div>

      <Tabs value={tab} onValueChange={(v)=>{ setTab(v); window.location.hash = v; if (v === 'invoices') setTimeout(()=> numberInputRef.current?.focus(), 0); }}>
        <TabsList className="mb-4 flex flex-wrap gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="smartops">SmartOps</TabsTrigger>
          <TabsTrigger value="tenders">Tenders</TabsTrigger>
          <TabsTrigger value="rams">RAMS</TabsTrigger>
          <TabsTrigger value="diag">Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <section className="card animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Business Overview</h2>
            <div className="grid sm:grid-cols-4 gap-4">
              <KPITile label="Outstanding" value={`£${kpi.outstanding.toFixed(2)}`} />
              <KPITile label="Overdue" value={`£${kpi.overdue.toFixed(2)}`} />
              <KPITile label="Overdue Invoices" value={`${kpi.overdueCount}`} />
              <KPITile
                label="Next Due"
                value={kpi.nextDue ? `${kpi.nextDue.client} (${kpi.nextDue.dueDate})` : "—"}
              />
            </div>
            <div className="mt-4 text-sm text-gray-300">
              Next due: {kpi.nextDue ? `${kpi.nextDue.client} (${kpi.nextDue.dueDate})` : "—"}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4" id="invoices">
          <section className="card animate-fade-in">
            <h2 className="text-lg font-semibold mb-3">Invoice Tracker</h2>

            <div className="grid md:grid-cols-5 gap-2 mb-3">
              <input
                className="input"
                placeholder="INV number"
                ref={numberInputRef}
                value={newRow.number}
                onChange={(e) => setNewRow({ ...newRow, number: e.target.value })}
              />
              <input
                className="input"
                placeholder="Client"
                value={newRow.client}
                onChange={(e) => setNewRow({ ...newRow, client: e.target.value })}
              />
              <input
                className="input"
                type="number"
                step="0.01"
                placeholder="Total (£)"
                value={newRow.total}
                onChange={(e) => setNewRow({ ...newRow, total: Number(e.target.value) })}
              />
              <input
                className="input"
                type="date"
                value={newRow.dueDate || ""}
                onChange={(e) => setNewRow({ ...newRow, dueDate: e.target.value })}
              />
              <div className="flex gap-2">
                <select
                  className="input"
                  value={newRow.status}
                  onChange={(e) =>
                    setNewRow({ ...newRow, status: e.target.value as InvoiceRow["status"] })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <button className="button" onClick={addRow} aria-label="Add invoice">
                  Add
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <input
                className="input w-full md:w-80"
                placeholder="Filter invoices..."
                aria-label="Filter invoices"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <table className="table">
              <thead>
                <tr className="text-left">
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Total (£)</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.number}</td>
                    <td>{r.client}</td>
                    <td>{r.total.toFixed(2)}</td>
                    <td>{r.dueDate || "—"}</td>
                    <td
                      className={
                        r.status === "overdue"
                          ? "text-red-400"
                          : r.status === "paid"
                          ? "text-emerald-400"
                          : "text-gray-300"
                      }
                    >
                      {r.status}
                    </td>
                    <td className="text-right flex gap-2 justify-end">
                      {r.status !== "paid" && (
                        <button className="button" onClick={() => markPaid(i)}>
                          Mark paid
                        </button>
                      )}
                      <button className="button-secondary" onClick={() => removeRow(i)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-gray-400 py-4">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <section className="card animate-fade-in">
            <h2 className="text-lg font-semibold mb-3">AI Agent</h2>
            <p className="text-sm text-gray-300 mb-3">
              Ask things like: <em>“Who is overdue and by how much?”</em>, <em>“Draft a polite payment reminder to {"{client}"}”</em>, <em>“Projected cash flow this month?”</em>
            </p>
            <AgentChat />
          </section>
        </TabsContent>

        <TabsContent value="smartops" className="space-y-4">
          <section className="card animate-fade-in">
            <h2 className="text-lg font-semibold mb-3">SmartOps Panel (UK Construction)</h2>
            <p className="text-sm text-gray-300 mb-3">Run a health scan, search tenders, generate quotes, and get VAT/CIS advice.</p>
            <SmartOpsPanel />
          </section>
        </TabsContent>

        <TabsContent value="tenders" className="space-y-4" id="tenders">
          <section className="card animate-fade-in">
            <h2 className="text-lg font-semibold mb-3">TenderBot (Website Scraper)</h2>
            <p className="text-sm text-gray-300 mb-3">Crawl tender portals and extract pages using Firecrawl.</p>
            <TenderBot />
          </section>
        </TabsContent>

        <TabsContent value="rams" className="space-y-4">
          <section className="card animate-fade-in">
            <h2 className="text-lg font-semibold mb-3">RAMS Generator</h2>
            <p className="text-sm text-gray-300 mb-3">Generate a printable RAMS document for your project.</p>
            <RamsGenerator />
          </section>
        </TabsContent>

        <TabsContent value="diag" className="space-y-4">
          <section className="card animate-fade-in">
            <h2 className="text-lg font-semibold mb-3">Function Diagnostics</h2>
            <p className="text-sm text-gray-300 mb-3">Quickly verify all Edge Functions are reachable and returning data.</p>
            <FunctionDiagnostics />
          </section>
        </TabsContent>
      </Tabs>
      </main>
    </>
  );
}

function KPITile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-900 rounded-md p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
