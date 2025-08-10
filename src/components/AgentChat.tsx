import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type InvoiceRow = {
  number: string;
  client: string;
  total: number;
  dueDate?: string;
  status: "draft" | "sent" | "paid" | "overdue";
};

type ChatMsg = { role: "user" | "assistant"; content: string };

const LS_KEY = "as-invoices";

export default function AgentChat() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Hi! I can analyse your invoices, find overdue amounts, and draft client emails. What do you need?",
    },
  ]);
  const [input, setInput] = useState("");
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setInvoices(JSON.parse(localStorage.getItem(LS_KEY) || "[]"));
    } catch {}
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("agent", {
        body: { message: text, invoices },
      });
      if (error) throw error;
      setMessages((m) => [
        ...m,
        { role: "assistant", content: (data as any)?.reply || "…" },
      ]);
    } catch (e: any) {
      console.error(e);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I hit an error. Try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="bg-gray-900 rounded-md p-3 h-72 overflow-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${
              m.role === "user" ? "text-emerald-300" : "text-gray-200"
            }`}
          >
            <b>{m.role === "user" ? "You" : "Agent"}: </b>
            {m.content}
          </div>
        ))}
        {busy && <div className="text-gray-400">Thinking…</div>}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="Ask about overdue totals, draft emails, cash flow…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button className="button" onClick={send} disabled={busy}>
          Send
        </button>
        <button
          className="button-secondary"
          onClick={() => {
            try {
              setInvoices(JSON.parse(localStorage.getItem(LS_KEY) || "[]"));
            } catch {}
          }}
          title="Reload invoices from tracker"
        >
          Reload Invoices
        </button>
      </div>
    </div>
  );
}
